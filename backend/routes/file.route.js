const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const fileController = require("../controllers/file.controller");

router.post("/upload", auth, upload.single("file"), fileController.uploadFile);
router.get("/download/:fileId", auth, fileController.downloadFile);

module.exports = router;
