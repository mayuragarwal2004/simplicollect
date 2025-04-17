const express = require("express");
const router = express.Router();
const imageUploadController = require("../controller/imageUploadControllers");
const verifyBulkMiddleware = require("../../middlewares/verifyBulk.middleware");
const multer = require("multer");

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Route to upload image
router.post("/", upload.single("image"), imageUploadController.uploadImage);

// Route to upload Excel file
router.post("/upload-excel", upload.single("excelFile"),verifyBulkMiddleware, imageUploadController.checkAndSaveMembers);


module.exports = router;
