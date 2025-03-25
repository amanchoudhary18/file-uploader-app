const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const folderController = require("../controllers/folder.controller");

router.get("/", auth, folderController.getFolderContents);
router.post("/", auth, folderController.createFolder);

module.exports = router;
