const excelToJson = require("convert-excel-to-json");

const verifyBulkMiddleware = (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Error counters object
  const expectedErrors = {
    missingHeaders: 0,
    duplicateEmail: 0,
    duplicatePhoneNumber: 0,
    noFirstName: 0,
    noPhoneAndEmail: 0,
    invalidRoleName: 0,
    noJoinDate: 0,
    noLastName: 0,
  };

  // Detailed error information
  const errorDetails = {
    missingHeaders: [],
    duplicateEmail: [],
    duplicatePhoneNumber: [],
    noFirstName: [],
    noPhoneAndEmail: [],
    invalidRoleName: [],
    noJoinDate: [],
    noLastName: [],
  };

  try {
    // Convert Excel to JSON
    const Bulk = excelToJson({
      source: file.buffer,
      header: {
        rows: 0,
      },
      sheets: ["Data Definitions (Roles)", "Template"],
    });

    const sheetNames = Object.keys(Bulk);
    if (sheetNames.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Both sheet 2 and sheet 3 are required in the Excel file",
      });
    }

    // Process role definitions from sheet 2
    const roleSheet = Bulk[sheetNames[0]];
    if (!roleSheet || roleSheet.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sheet 2 Data Definitions (Roles) has no data",
      });
    }

    // Create a mapping of role names to role IDs
    const roleNameToIdMap = new Map();
    for (let i = 0; i < roleSheet.length; i++) {
      const row = roleSheet[i];
      const roleName = row["B"]; // Assuming role names are in column B
      const roleId = row["A"]; // Assuming role IDs are in column A

      if (roleName && roleName.toString().trim() !== "" && roleId) {
        roleNameToIdMap.set(roleName.toString().trim(), roleId);
      }
    }

    if (roleNameToIdMap.size === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid Role Name to ID mappings found in Sheet 2",
      });
    }

    // Process member data from sheet 3
    let memberSheet = Bulk[sheetNames[1]];
    if (!memberSheet || memberSheet.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sheet 3 (member data) has no data",
      });
    }

    // Filter out completely empty rows
    memberSheet = memberSheet.filter((row) => {
      return (
        (row["A"] !== undefined && row["A"] !== null && row["A"] !== "") ||
        (row["B"] !== undefined && row["B"] !== null && row["B"] !== "") ||
        (row["C"] !== undefined && row["C"] !== null && row["C"] !== "") ||
        (row["D"] !== undefined && row["D"] !== null && row["D"] !== "") ||
        (row["E"] !== undefined && row["E"] !== null && row["E"] !== "") ||
        (row["F"] !== undefined && row["F"] !== null && row["F"] !== "")
      );
    });

    // Check required headers
    const requiredHeaders = [
      "First Name",
      "Last Name",
      "Email",
      "Phone Number",
      "Role Name",
      "Join Date",
    ];
    const headers = Object.values(memberSheet[0] || {});
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      expectedErrors.missingHeaders = missingHeaders.length;
      errorDetails.missingHeaders = missingHeaders;

      return res.status(400).json({
        success: false,
        message: "Missing required headers in Excel file",
        errors: expectedErrors,
        errorDetails: errorDetails,
      });
    }

    // Prepare for validation and data transformation
    const emails = new Set();
    const phoneNumbers = new Set();
    const processedData = [];

    // Process each row (skip header row)
    for (let i = 0; i < memberSheet.length; i++) {
      const originalRow = memberSheet[i];
      const rowNum = i + 2;

      // Create a copy of the row to modify
      const row = { ...originalRow };

      const firstName = row["A"];
      const lastName = row["B"];
      const email = row["C"];
      const phoneNumber = row["D"];
      let roleName = row["E"];
      const joinDate = row["F"];

      // Validate and transform role name to ID
      if (roleName && roleName.toString().trim() !== "") {
        const trimmedRoleName = roleName.toString().trim();
        if (roleNameToIdMap.has(trimmedRoleName)) {
          // Replace role name with role ID
          row["E"] = roleNameToIdMap.get(trimmedRoleName);
        } else {
          expectedErrors.invalidRoleName++;
          errorDetails.invalidRoleName.push({
            row: rowNum,
            roleName: roleName,
            message: `Row ${rowNum}: Invalid role Name - ${roleName} not found in sheet 2`,
          });
        }
      } else {
        expectedErrors.invalidRoleName++;
        errorDetails.invalidRoleName.push({
          row: rowNum,
          message: `Row ${rowNum}: Missing role Name`,
        });
      }

      // Other validations (same as before)
      if (!firstName || firstName.trim() === "") {
        expectedErrors.noFirstName++;
        errorDetails.noFirstName.push({
          row: rowNum,
          message: `Row ${rowNum}: Missing first name`,
        });
      }

      if (!lastName || lastName.trim() === "") {
        expectedErrors.noLastName++;
        errorDetails.noLastName.push({
          row: rowNum,
          message: `Row ${rowNum}: Missing last name`,
        });
      }

      const hasEmail = email && email.trim() !== "";
      const hasPhone = phoneNumber && phoneNumber.toString().trim() !== "";

      if (!hasEmail && !hasPhone) {
        expectedErrors.noPhoneAndEmail++;
        errorDetails.noPhoneAndEmail.push({
          row: rowNum,
          message: `Row ${rowNum}: Neither email nor phone number is provided`,
        });
      }

      if (hasEmail) {
        const normalizedEmail = email.toLowerCase().trim();
        if (emails.has(normalizedEmail)) {
          expectedErrors.duplicateEmail++;
          errorDetails.duplicateEmail.push({
            row: rowNum,
            email: email,
            message: `Row ${rowNum}: Duplicate email - ${email}`,
          });
        } else {
          emails.add(normalizedEmail);
        }
      }

      if (hasPhone) {
        const normalizedPhone = phoneNumber.toString().replace(/\D/g, "");
        if (phoneNumbers.has(normalizedPhone)) {
          expectedErrors.duplicatePhoneNumber++;
          errorDetails.duplicatePhoneNumber.push({
            row: rowNum,
            phoneNumber: phoneNumber,
            message: `Row ${rowNum}: Duplicate phone number - ${phoneNumber}`,
          });
        } else {
          phoneNumbers.add(normalizedPhone);
        }
      }

      if (!joinDate) {
        expectedErrors.noJoinDate++;
        errorDetails.noJoinDate.push({
          row: rowNum,
          message: `Row ${rowNum}: Missing join date`,
        });
      }

      // Add the processed row to our final data
      processedData.push(row);
    }

    // Check if there are any validation errors
    const hasErrors = Object.values(expectedErrors).some((count) => count > 0);
    if (hasErrors) {
      req.hasErrors = hasErrors;
      req.errors = expectedErrors;
      req.errorDetails = errorDetails;
    }

    // Store the processed data with role IDs instead of role names
    req.parsedExcel = processedData;
    next();
  } catch (error) {
    console.error("Error processing Excel file:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing Excel file",
      error: error.message,
    });
  }
};

module.exports = verifyBulkMiddleware;
