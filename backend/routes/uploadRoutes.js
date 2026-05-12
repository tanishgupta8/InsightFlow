const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");
const { optionalProtect } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", optionalProtect, upload.single("file"), uploadController.uploadFile);

module.exports = router;