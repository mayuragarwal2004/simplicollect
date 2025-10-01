function configureInstructionsSheet(sheet) {
  // Set column widths
  sheet.columns = [
    { header: '', width: 2 },  // A
    { header: '', width: 40 }, // B
    { header: '', width: 10 }, // C
    { header: '', width: 10 }, // D
    { header: '', width: 10 }, // E
    { header: '', width: 10 }, // F
    { header: '', width: 10 }, // G
    { header: '', width: 10 }, // H
    { header: '', width: 10 }, // I
    { header: '', width: 10 }, // J
    { header: '', width: 10 }, // K
    { header: '', width: 10 }, // L
    { header: '', width: 10 }, // M
    { header: '', width: 10 }  // N
  ];
  
  // Add title
  const titleRow = sheet.addRow(['', 'SimpliCollect']);
  titleRow.height = 50;
  
  // Style title cell
  const titleCell = titleRow.getCell(2);
  titleCell.font = {
    name: 'Calibri',
    size: 24,
    bold: true
  };
  titleCell.alignment = {
    horizontal: 'center'
  };
  
  // Merge cells for title
  sheet.mergeCells('B1:N1');
  
  // Add empty row
  sheet.addRow([]);
  
  // Create header for instructions
  const instructionHeader = sheet.addRow(['', 'How to Use the Chapter Member Upload File']);
  instructionHeader.height = 20;
  instructionHeader.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Fill background color for header
  instructionHeader.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber >= 2 && colNumber <= 14) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' } // Light gray
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });
  
  // Merge cells for instruction header
  sheet.mergeCells('B3:N3');
  
  // Add instruction text
  const introRow = sheet.addRow(['', 'This file is used to add new members to a chapter. Follow the steps below to ensure a successful upload.']);
  introRow.height = 20;
  
  // Style intro text row
  for (let i = 2; i <= 14; i++) {
    introRow.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  // Merge cells for intro text
  sheet.mergeCells('B4:N4');
  
  // Add note about template version
  const noteRow = sheet.addRow(['', 'If you do not have the latest version of this template, download it again from the system to avoid issues.']);
  noteRow.height = 20;
  
  // Style note row
  for (let i = 2; i <= 14; i++) {
    noteRow.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  // Merge cells for note
  sheet.mergeCells('B5:N5');
  
  // Add sub-header for using the file
  const subHeader = sheet.addRow(['', 'How to use this file']);
  subHeader.height = 20;
  subHeader.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Fill background color for sub-header
  subHeader.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber >= 2 && colNumber <= 14) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' } // Light gray
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });
  
  // Merge cells for sub-header
  sheet.mergeCells('B6:N6');
  
  // Add steps without merging
  const stepsData = [
    [1, 'Review the sheets in this file', 'to understand the available roles and required fields.'],
    [2, 'Enter member details', 'in the "Members" sheet. You must provide an Email or Phone Number (at least one, and it must be unique).'],
    [3, 'Ensure the Role Name is valid', 'by referring to the "Roles" sheet.'],
    [4, 'Do not modify the structure', 'of the file. Changing sheet names or column headers will cause rejection.'],
    [5, 'Save the file in the required format', '(Excel) and upload it to the system.']
  ];
  
  let rowIndex = 7;
  
  stepsData.forEach(stepData => {
    const [stepNumber, title, description] = stepData;
    const row = sheet.addRow(['', `${stepNumber}. ${title}`, description]);
    row.height = 20;
    
    // Style the cells
    row.getCell(2).font = {
      name: 'Calibri',
      size: 11,
      bold: true
    };
    
    // Style the cells with borders
    for (let i = 2; i <= 14; i++) {
      row.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Merge description cells (we need to merge from column C to N)
    if (description) {
      sheet.mergeCells(`C${rowIndex}:N${rowIndex}`);
    }
    
    rowIndex++;
  });
  
  // Add validation rules section
  const validationHeader = sheet.addRow(['', 'Validation Rules for Upload']);
  validationHeader.height = 20;
  validationHeader.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Fill background color for validation header
  validationHeader.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber >= 2 && colNumber <= 14) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' } // Light gray
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });
  
  // Merge cells for validation header
  sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
  rowIndex++;
  
  // Add rejection notice
  const rejectionRow = sheet.addRow(['', 'Your upload will be rejected if:']);
  rejectionRow.height = 20;
  rejectionRow.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Style rejection row
  for (let i = 2; i <= 14; i++) {
    rejectionRow.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  // Merge cells for rejection notice
  sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
  rowIndex++;
  
  // Add rejection rules
  const rules = [
    'The Email or Phone Number already exists in the system but with a mismatched pair (Email exists, but with a different Phone Number, or vice versa).',
    'The First Name is missing for a new user (a user whose Email/Phone is not already in the system).',
    'The Role ID does not exist in the "Roles" sheet.',
    'There is a change in roles in the system that does not match this file. Always use the latest template.',
    'The structure of the Member or Role table has been modified.',
    'The email/phone number is already part of the chapter.'
  ];
  
  rules.forEach(rule => {
    const ruleRow = sheet.addRow(['', `• ${rule}`]);
    ruleRow.height = 20;
    
    // Style rule row
    for (let i = 2; i <= 14; i++) {
      ruleRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Merge cells for rule
    sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
    rowIndex++;
  });
  
  // Add empty row
  const emptyRow1 = sheet.addRow(['']);
  rowIndex++;
  
  // Add after uploading section
  const afterUploadHeader = sheet.addRow(['', 'After Uploading']);
  afterUploadHeader.height = 20;
  afterUploadHeader.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Fill background color for after upload header
  afterUploadHeader.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber >= 2 && colNumber <= 14) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' } // Light gray
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });
  
  // Merge cells for after upload header
  sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
  rowIndex++;
  
  // Add after uploading steps
  const uploadSteps = [
    '1. The system will process your file and show:',
    '   • The number of valid members to be added.',
    '   • A summary of rejected records with reasons.',
    '2. You can download a marked file to see which records were rejected and why.',
    '3. After confirming, valid records will be added to the chapter.'
  ];
  
  uploadSteps.forEach(step => {
    const stepRow = sheet.addRow(['', step]);
    stepRow.height = 20;
    
    // Style step row
    for (let i = 2; i <= 14; i++) {
      stepRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Merge cells for step
    sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
    rowIndex++;
  });
  
  // Add empty row
  const emptyRow2 = sheet.addRow(['']);
  rowIndex++;
  
  // Add important information section
  const importantHeader = sheet.addRow(['', 'Important Information']);
  importantHeader.height = 20;
  importantHeader.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Fill background color for important header
  importantHeader.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber >= 2 && colNumber <= 14) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' } // Light gray
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });
  
  // Merge cells for important header
  sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
  rowIndex++;
  
  // Add email & phone section
  const emailPhoneHeader = sheet.addRow(['', 'Email & Phone Matching:']);
  emailPhoneHeader.height = 20;
  emailPhoneHeader.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Style email phone header
  for (let i = 2; i <= 14; i++) {
    emailPhoneHeader.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  
  // Merge cells for email phone header
  sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
  rowIndex++;
  
  // Add email phone rules
  const emailPhoneRules = [
    'If only Email is provided and it exists in the system — The member will be added.',
    'If only Phone Number is provided and it exists in the system — The member will be added.',
    'If both are provided and one already exists but with a different pair — Rejected.',
    'If neither exists — A new user will be created (First Name is required).'
  ];
  
  emailPhoneRules.forEach(rule => {
    const ruleRow = sheet.addRow(['', `• ${rule}`]);
    ruleRow.height = 20;
    
    // Style rule row
    for (let i = 2; i <= 14; i++) {
      ruleRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Merge cells for rule
    sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
    rowIndex++;
  });
  
  // Add empty row
  const emptyRow3 = sheet.addRow(['']);
  rowIndex++;
  
  // Add roles section
  const rolesHeader = sheet.addRow(['', 'Roles']);
  rolesHeader.height = 20;
  rolesHeader.getCell(2).font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Style roles header
  for (let i = 2; i <= 14; i++) {
    rolesHeader.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  
  // Merge cells for roles header
  sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
  rowIndex++;
  
  // Add roles rules
  const rolesRules = [
    'Each member must have a valid Role ID from the "Roles" sheet.',
    'If roles have changed, download a new template before uploading.'
  ];
  
  rolesRules.forEach(rule => {
    const ruleRow = sheet.addRow(['', `• ${rule}`]);
    ruleRow.height = 20;
    
    // Style rule row
    for (let i = 2; i <= 14; i++) {
      ruleRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    
    // Merge cells for rule
    sheet.mergeCells(`B${rowIndex}:N${rowIndex}`);
    rowIndex++;
  });
}

// This function has been removed since we implemented the steps directly in the configureInstructionsSheet function

function configureRolesSheet(sheet,rolesInfo) {
  // Set column widths
  sheet.columns = [
    { header: 'Role Id', width: 10 },
    { header: 'Role Name', width: 20 },
    { header: 'Role Description', width: 40 }
  ];
  
  // Style the header row
  const headerRow = sheet.getRow(1);
  headerRow.height = 20;
  headerRow.font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Add background color to header
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' } // Light gray
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
  });
  
  // Add role data
  const roleData = rolesInfo.map(role => [
    role.roleId,        // convert roleId to number
    role.roleName,
    role.roleDescription
  ]);
  
  roleData.forEach(role => {
    const row = sheet.addRow(role);
    row.height = 20;
    
    // Add borders to cells
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });
}

function configureTemplateSheet(sheet) {
  // Set column widths
  sheet.columns = [
    { header: 'First Name', width: 15 },
    { header: 'Last Name', width: 15 },
    { header: 'Email', width: 30 },
    { header: 'Phone Number', width: 15 },
    { header: 'Role Name', width: 15 },
    { header: 'Join Date', width: 15 }
  ];
  
  // Style the header row
  const headerRow = sheet.getRow(1);
  headerRow.height = 20;
  headerRow.font = {
    name: 'Calibri',
    size: 11,
    bold: true
  };
  
  // Add background color to header
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' } // Light gray
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
  });
  
  // Add a few empty rows for data entry
  for (let i = 0; i < 10; i++) {
    const row = sheet.addRow(['', '', '', '', '', '']);
    
    // Add borders to cells
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }
}

module.exports={configureInstructionsSheet,configureRolesSheet,configureTemplateSheet}