const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const File = require("../models/file.model");
const Folder = require("../models/folder.model");
const { deleteFileFromS3 } = require("../utils/s3Utils");
const User = require("../models/user.model");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File upload failed" });
  }

  const user = req.user;
  const { folderId } = req.query;
  const fileKey = req.file.key;
  const fileSize = req.file.size;

  try {
    const userData = await User.findById(user.id);

    if (!userData) {
      await deleteFileFromS3(fileKey);
      return res.status(404).json({ message: "User not found" });
    }

    const remainingStorage = userData.storageLimit - userData.usedStorage;

    if (fileSize > remainingStorage) {
      await deleteFileFromS3(fileKey);
      return res.status(400).json({ message: "Not enough storage space" });
    }

    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, userId: user.id });
      if (!folder) {
        await deleteFileFromS3(fileKey);
        return res.status(400).json({ message: "Invalid folder ID" });
      }
    }

    const file = new File({
      userId: user.id,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: fileSize,
      s3Path: fileKey,
      folderId: folderId || null,
    });

    await file.save();

    // Update user's used storage
    userData.usedStorage += fileSize;
    await userData.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    await deleteFileFromS3(fileKey);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3Path,
    };

    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.json({ downloadUrl: signedUrl });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Download failed", error: error.message });
  }
};

module.exports = { uploadFile, downloadFile };
