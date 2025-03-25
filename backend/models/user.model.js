const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null },
    storageLimit: { type: Number, default: 128 * 1024 * 1024 },
    usedStorage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
