const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    s3Path: { type: String, required: true },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
