const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const fileRoutes = require("./routes/file.route");
const folderRoutes = require("./routes/folder.route");

dotenv.config();

connectDB();

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Welcome to File Uploader");
});

app.use("/auth", authRoutes);
app.use("/file", fileRoutes);
app.use("/folder", folderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
