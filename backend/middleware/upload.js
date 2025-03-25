const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { allowedTypes } = require("../utils/constants");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
