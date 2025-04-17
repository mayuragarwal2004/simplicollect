// controllers/imageUploadController
console.log("controller file loaded");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const { uploadToS3 } = require("../../config/aws");
const path = require("path");
const checkDataModel = require("../models/checkDataModel");

const uploadImage = async (req, res) => {
  if (req.file) {
    const folderName = req.body.folderName;
    try {
      let compressedImageBuffer;
      let fileName;

      // Check if the uploaded file is an image
      switch (req.file.mimetype) {
        case "image/jpeg":
        case "image/jpg":
        case "image/png":
          // Compress the uploaded image using Jimp
          if (
            process.env.COMPRESS_IMAGE === "true" &&
            parseInt(process.env.COMPRESS_IMAGE_QUALITY)
          ) {
            const image = await Jimp.read(req.file.buffer);
            image.quality(parseInt(process.env.COMPRESS_IMAGE_QUALITY)); // Adjust quality as needed
            compressedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
          }

          // Generate a unique file name for the compressed image
          fileName = `${uuidv4()}.jpg`; // Save as jpg
          break;
        default:
          // For non-image files, upload directly
          fileName = `${uuidv4()}_${req.file.originalname}`;
          break;
      }

      // Check the size of compressed image buffer before uploading
      if (
        process.env.LIMIT_FILE_SIZE === "true" &&
        compressedImageBuffer &&
        compressedImageBuffer.length > process.env.MAX_FILE_SIZE
      ) {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit after compression" });
      }

      if (folderName) {
        fileName = `${folderName}/${fileName}`;
      }

      if (process.env.UPLOAD_DIREECTORY) {
        fileName = `${process.env.UPLOAD_DIREECTORY}/${fileName}`;
      }

      // Upload the file to Amazon S3
      const s3UploadResult = await uploadToS3(
        fileName,
        compressedImageBuffer || req.file.buffer
      );

      // Check if S3 upload was successful
      if (!s3UploadResult.success) {
        return res.status(500).json({ error: "Error uploading file to S3" });
      }

      // Respond with success
      return res.status(200).json({
        success: true,
        message: `File uploaded successfully. File is avaiable at ${s3UploadResult.imageUrl}`,
        imageUrl: s3UploadResult.imageUrl,
      });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(400).json({ error: "No file uploaded" });
  }
};

const checkAndSaveMembers = async (req, res) => {
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

module.exports = {
  uploadImage,
  checkAndSaveMembers
};
