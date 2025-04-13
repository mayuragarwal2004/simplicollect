const excelToJson = require('convert-excel-to-json');

const verifyBulkMiddleware = (req, res, next) => {
    const file = req.file; // Assuming you're using multer or similar middleware for file uploads
    
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Error counters object
    const expectedErrors = {
        missingHeaders: 0,
        duplicateEmail: 0,
        duplicatePhoneNumber: 0,
        noFirstName: 0,
        noPhoneAndEmail: 0,
        invalidRoleId: 0,
        noJoinDate: 0,
        noLastName: 0 // Optional but good to track
    };
    
    // Detailed error information
    const errorDetails = {
        missingHeaders: [],
        duplicateEmail: [],
        duplicatePhoneNumber: [],
        noFirstName: [],
        noPhoneAndEmail: [],
        invalidRoleId: [],
        noJoinDate: [],
        noLastName: []
    };
    
    try {
        // Convert Excel to JSON - Get both sheet 2 and sheet 3
        const Bulk = excelToJson({
            source: file.buffer,
            header: {
                rows: 1 // Use the first row as headers
            },
            sheets: [1, 2] // 0-indexed, so sheet 2 is index 1 and sheet 3 is index 2
        });
        
        // Get sheet names
        const sheetNames = Object.keys(Bulk);
        if (sheetNames.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Both sheet 2 and sheet 3 are required in the Excel file'
            });
        }
        
        // Get sheet 2 for RoleIds (index 1)
        const roleSheet = Bulk[sheetNames[0]];
        if (!roleSheet || roleSheet.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Sheet 2 (Role IDs) has no data'
            });
        }
        
        // Extract valid role IDs from sheet 2 (first column, starting from row 2)
        const validRoleIds = new Set();
        
        for (let i = 0; i < roleSheet.length; i++) {
            const row = roleSheet[i];
            // Get the first column value (Role ID)
            const roleIdKey = Object.keys(row)[0]; // First column key
            const roleId = row[roleIdKey];
            
            if (roleId !== undefined && roleId !== null && roleId !== '') {
                // Convert to string for consistent comparison
                validRoleIds.add(String(roleId));
            }
        }
        
        // If no valid role IDs found, return an error
        if (validRoleIds.size === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid Role IDs found in Sheet 2'
            });
        }
        
        // Get sheet 3 (index 2) with member data
        const memberSheet = Bulk[sheetNames[1]];
        if (!memberSheet || memberSheet.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Sheet 3 (member data) has no data'
            });
        }
        
        // Check if all required headers exist in sheet 3
        const requiredHeaders = ['First Name', 'Last Name', 'Email', 'Phone Number', 'Role id', 'Join Date'];
        const headers = Object.keys(memberSheet[0] || {});
        
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        
        if (missingHeaders.length > 0) {
            expectedErrors.missingHeaders = missingHeaders.length;
            errorDetails.missingHeaders = missingHeaders;
            
            return res.status(400).json({
                success: false,
                message: 'Missing required headers in Excel file',
                errors: expectedErrors,
                errorDetails: errorDetails
            });
        }
        
        // Check for duplicate emails, duplicate phone numbers
        const emails = new Set();
        const phoneNumbers = new Set();
        
        // Process each row for validation
        for (let i = 0; i < memberSheet.length; i++) {
            const row = memberSheet[i];
            const rowNum = i + 2; // +2 because Excel is 1-indexed and we have a header row
            
            const firstName = row['First Name'];
            const lastName = row['Last Name'];
            const email = row['Email'];
            const phoneNumber = row['Phone Number'];
            const roleId = row['Role id'];
            const joinDate = row['Join Date'];
            
            // Check for missing firstName (required)
            if (!firstName || firstName.trim() === '') {
                expectedErrors.noFirstName++;
                errorDetails.noFirstName.push({
                    row: rowNum,
                    message: `Row ${rowNum}: Missing first name`
                });
            }
            
            // Check for missing lastName (good to have, but optional)
            if (!lastName || lastName.trim() === '') {
                expectedErrors.noLastName++;
                errorDetails.noLastName.push({
                    row: rowNum,
                    message: `Row ${rowNum}: Missing last name`
                });
            }
            
            // Check that at least one contact method exists (email or phone)
            const hasEmail = email && email.trim() !== '';
            const hasPhone = phoneNumber && phoneNumber.toString().trim() !== '';
            
            if (!hasEmail && !hasPhone) {
                expectedErrors.noPhoneAndEmail++;
                errorDetails.noPhoneAndEmail.push({
                    row: rowNum,
                    message: `Row ${rowNum}: Neither email nor phone number is provided`
                });
            }
            
            // Check for duplicate email
            if (hasEmail) {
                const normalizedEmail = email.toLowerCase().trim();
                if (emails.has(normalizedEmail)) {
                    expectedErrors.duplicateEmail++;
                    errorDetails.duplicateEmail.push({
                        row: rowNum,
                        email: email,
                        message: `Row ${rowNum}: Duplicate email - ${email}`
                    });
                } else {
                    emails.add(normalizedEmail);
                }
            }
            
            // Check for duplicate phone number
            if (hasPhone) {
                const normalizedPhone = phoneNumber.toString().replace(/\D/g, ''); // Remove non-digits
                if (phoneNumbers.has(normalizedPhone)) {
                    expectedErrors.duplicatePhoneNumber++;
                    errorDetails.duplicatePhoneNumber.push({
                        row: rowNum,
                        phoneNumber: phoneNumber,
                        message: `Row ${rowNum}: Duplicate phone number - ${phoneNumber}`
                    });
                } else {
                    phoneNumbers.add(normalizedPhone);
                }
            }
            
            // Check for missing role ID and validate against sheet 2
            if (!roleId && roleId !== 0) {
                expectedErrors.invalidRoleId++;
                errorDetails.invalidRoleId.push({
                    row: rowNum,
                    message: `Row ${rowNum}: Missing role id`
                });
            } else if (!validRoleIds.has(String(roleId))) {
                // Role ID is present but not in the valid list from sheet 2
                expectedErrors.invalidRoleId++;
                errorDetails.invalidRoleId.push({
                    row: rowNum,
                    roleId: roleId,
                    message: `Row ${rowNum}: Invalid role id - ${roleId} not found in sheet 2`
                });
            }
            
            // Check for missing join date
            if (!joinDate) {
                expectedErrors.noJoinDate++;
                errorDetails.noJoinDate.push({
                    row: rowNum,
                    message: `Row ${rowNum}: Missing join date`
                });
            }
        }
        
        // Check if there are any validation errors
        const hasErrors = Object.values(expectedErrors).some(count => count > 0);
        
        if (hasErrors) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors in Excel file',
                errors: expectedErrors,
                errorDetails: errorDetails
            });
        }
        
        // Store parsed data in request for subsequent middleware/route handlers
        req.parsedExcel = memberSheet;
        next();
    } catch (error) {
        console.error('Error processing Excel file:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing Excel file',
            error: error.message
        });
    }
};

module.exports = verifyBulkMiddleware;