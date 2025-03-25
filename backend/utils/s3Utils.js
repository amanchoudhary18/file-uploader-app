const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const deleteFileFromS3 = async (fileKey) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      })
    );
    console.log(`✅ File deleted from S3: ${fileKey}`);
  } catch (error) {
    console.error(`❌ Failed to delete file from S3: ${fileKey}`, error);
  }
};

module.exports = { s3, deleteFileFromS3 };
