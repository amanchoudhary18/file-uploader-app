const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const File = require("../models/file.model");

const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const files = await File.find({ userId: req.user.id });

    const categories = {
      document: 0,
      image: 0,
      json: 0,
      others: 0,
    };

    let totalUsed = 0;

    files.forEach((file) => {
      totalUsed += file.size;

      if (file.type.includes("text")) {
        categories.document += file.size;
      } else if (file.type.includes("image")) {
        categories.image += file.size;
      } else if (file.type.includes("json")) {
        categories.json += file.size;
      } else {
        categories.others += file.size;
      }
    });

    const { name, email, profilePic, storageLimit } = user;

    res.json({
      name,
      email,
      profilePic,
      storageLimit,
      totalUsed,
      categories,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { register, login, getUserProfile };
