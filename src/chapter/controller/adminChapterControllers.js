// controllers/adminChapterControllers.js
const adminChapterModel = require("../model/adminChapterModel");
const { v4: uuidv4 } = require("uuid");
const xlsx = require("xlsx");
const checkDataModel = require('../model/checkDataModel');

// Get chapter details by chapterId
const getChapterById = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const chapter = await adminChapterModel.findChapterById(chapterId);
    if (chapter) {
      res.json(chapter);
    } else {
      res.status(404).json({ message: "Chapter not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateChapterDetails = async (req, res) => {
  const { chapterId } = req.params;
  const updatedDetails = req.body;
  try {
    const updatedChapter = await adminChapterModel.updateChapter(
      chapterId,
      updatedDetails
    );
    if (updatedChapter) {
      res.json(updatedChapter);
    } else {
      res.status(404).json({ message: "Chapter not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllChaptersController = async (req, res) => {
  const { rows, page } = req.query;

  try {
    const { chapters, totalRecords } = await adminChapterModel.getAllChapters(
      rows,
      page
    );
    if (!chapters || chapters.length === 0) {
      return res.status(404).json({ message: "No chapters found" });
    }
    res.json({
      data: chapters,
      totalRecords,
      rows,
      page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createChapter = async (req, res) => {
  try {
    const chapterData = req.body;

    // Validate required fields
    if (
      !chapterData.chapterName ||
      !chapterData.chapterSlug ||
      !chapterData.meetingPeriodicity ||
      !chapterData.meetingPaymentType ||
      !chapterData.visitorPerMeetingFee ||
      !chapterData.organisationId
    ) {
      return res.status(400).json({ error: "Required fields are missing" });
    }
    const validPeriodicities = [
      "weekly",
      "fortnightly",
      "monthly",
      "bi-monthly",
      "quarterly",
      "6-monthly",
      "yearly",
    ];
    if (!validPeriodicities.includes(chapterData.meetingPeriodicity)) {
      return res.status(400).json({ error: "Invalid meeting periodicity" });
    }

    const validPaymentTypes = ["weekly", "monthly", "quarterly"];
    if (
      !chapterData.meetingPaymentType
        .split(",")
        .every((type) => validPaymentTypes.includes(type.trim()))
    ) {
      return res.status(400).json({ error: "Invalid meeting payment type" });
    }
    // Create the chapter
    const newChapter = await adminChapterModel.createChapter(chapterData);

    res.status(201).json(newChapter);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const chapter = await adminChapterModel.findChapterById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    await adminChapterModel.deleteChapter(chapterId);
    res.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(500).json({ error: error.message });
  }
};

const getRolesByChapterSlug = async (req, res) => {
  const { chapterSlug } = req.params;
  try {
    const roles = await adminChapterModel.getRolesByChapterSlug(chapterSlug);
    if (roles) {
      res.json(roles);
    } else {
      res.status(404).json({ message: "Roles not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const addRole = async (req, res) => {
  const { chapterSlug } = req.params;
  const roleData = req.body;
  try {
    const newRole = await adminChapterModel.addRole(chapterSlug, {
      roleId: uuidv4(),
      ...roleData,
    });
    res.status(201).json(newRole);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const editRole = async (req, res) => {
  const { chapterSlug, roleId } = req.params;
  const updatedRoleData = req.body;
  try {
    const updatedRole = await adminChapterModel.editRole(
      chapterSlug,
      roleId,
      updatedRoleData
    );
    if (updatedRole) {
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const deleteRole = async (req, res) => {
  const { chapterSlug, roleId } = req.params;
  try {
    const deletedRole = await adminChapterModel.deleteRole(chapterSlug, roleId);
    if (deletedRole) {
      res.json({ message: "Role deleted successfully" });
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const checkAndSaveMembers = async (req, res) => {
  if(req.hasErrors){
    return res.status(400).json({
                success: false,
                message: 'Validation errors in Excel file',
                errors: req.expectedErrors,
                errorDetails: req.errorDetails
            });
  }
  const data = req.parsedExcel;
  const chapterId = req.query.chapterId;
  const errorRows = [];
  const validMembersToAdd = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const firstName = row["A"];
    const lastName = row["B"];
    const email = row["C"];
    const phoneNumber = row["D"];
    const roleId = row["E"];
    const joinDate = row["F"];
  
    const rowErrors = { row: i + 1, errors: [] };
    let rowHasError = false;
  
    const emailResult = email ? await checkDataModel.findMemberByEmail(email) : null;
    const phoneResult = phoneNumber ? await checkDataModel.findMemberByPhone(phoneNumber) : null;
  
    const emailMemberId = emailResult?.[0]?.memberId;
    const phoneMemberId = phoneResult?.[0]?.memberId;
  
    let emailInChapter = false;
    if (emailMemberId) {
      console.log("emailMemberId", emailMemberId);
      const emailCheck = await checkDataModel.isMemberInChapter(emailMemberId, chapterId);
      emailInChapter = emailCheck.length > 0;
    }

    const phoneInChapter = phoneMemberId
      ? (await checkDataModel.isMemberInChapter(phoneMemberId, chapterId)).length > 0
      : false;
  
    const roleValid = await checkDataModel.isValidRoleForChapter(roleId, chapterId);
    if (!roleValid) {
      rowErrors.errors.push({ field: "roleId", reason: "Invalid role for this chapter." });
      rowHasError = true;
    }
    if (emailMemberId && phoneMemberId && emailMemberId !== phoneMemberId) {
      rowErrors.errors.push({ field: "email/phone", reason: "Email and phone belong to different members." });
      rowHasError = true;
    }
    if ((emailInChapter && emailMemberId) || (phoneInChapter && phoneMemberId)) {
      rowErrors.errors.push({ field: "chapter", reason: "Member already exists in this chapter." });
      rowHasError = true;
    }
    if (!emailMemberId && !phoneMemberId && !firstName) {
      rowErrors.errors.push({ field: "firstName", reason: "First name is required for new members." });
      rowHasError = true;
    }
    if (rowHasError) {
      errorRows.push(rowErrors);
    } else {
      const memberId = emailMemberId || phoneMemberId || null;
      validMembersToAdd.push({
        firstName,
        lastName,
        email,
        phoneNumber,
        roleId,
        joinDate,
        ...(memberId && { memberId })
      });
    }
  }
  

  if (errorRows.length > 0) {
    return res.status(400).json({
      message: "Validation failed. Please fix the errors and try again.",
      errors: errorRows
    });
  }

  return res.status(200).json({
    message: "Validation successful. All members are ready to be added.",
    previewData: validMembersToAdd
  });
};

const checkFormatAndReturnExcel = async (req, res) => {
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  console.log(workbook.SheetNames);
  const worksheet = workbook.Sheets['Template']; //template sheet
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
  const errorDetails = req.errorDetails;
  if(req.hasErrors){
    const errorMap = new Map();
    for (const errorType of Object.values(errorDetails)) {
      for (const { row, message } of errorType) {
        if (!errorMap.has(row)) {
          errorMap.set(row, []);
        }
        errorMap.get(row).push(message);
      }
    }
    jsonData.forEach((row, index) => {
      const excelRow = index + 2; // Because sheet_to_json skips header, and Excel starts at 1
      if (errorMap.has(excelRow)) {
        row['Error Details'] = errorMap.get(excelRow).join(', ');
      } else {
        row['Error Details'] = '';
      }
    });
  }
  const newWorksheet = xlsx.utils.json_to_sheet(jsonData);
    const newWorkbook = xlsx.utils.book_new();
    const worksheet1 = workbook.Sheets['Instructions']; // instructions sheet
  const worksheet2 = workbook.Sheets['Data Definitions (Roles)']; // roles sheet
  xlsx.utils.book_append_sheet(newWorkbook,worksheet1,'Instructions')
  xlsx.utils.book_append_sheet(newWorkbook,worksheet2,'Data Definitions (Roles)')
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Template'); // Add the new worksheet to the workbook

    const buffer = xlsx.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=validated_output.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

}

module.exports = {
  getChapterById,
  updateChapterDetails,
  getAllChaptersController,
  deleteChapter,
  createChapter,
  getRolesByChapterSlug,
  addRole,
  editRole,
  deleteRole,
  checkFormatAndReturnExcel,
  checkAndSaveMembers,
};
