// controllers/imageUploadController
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const { uploadToS3 } = require("../../config/aws");


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

module.exports = {
  uploadImage,
};
