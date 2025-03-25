const Folder = require("../models/folder.model");
const File = require("../models/file.model");

const getFolderContents = async (req, res) => {
  try {
    const { parentId } = req.query;
    const userId = req.user.id;

    if (parentId) {
      const parentFolder = await Folder.findOne({ _id: parentId, userId });

      if (!parentFolder) {
        return res.status(404).json({ message: "Folder not found" });
      }
    }

    const [folders, files] = await Promise.all([
      Folder.find({ userId, parentId: parentId === "null" ? null : parentId }),
      File.find({ userId, folderId: parentId === "null" ? null : parentId }),
    ]);

    res.status(200).json({ folders, files });
  } catch (error) {
    console.error("Error fetching folder contents:", error);
    res.status(500).json({
      message: "Server error while retrieving folder contents",
      error: error.message,
    });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id;

    const existingFolder = await Folder.findOne({ userId, name, parentId });
    if (existingFolder) {
      return res
        .status(400)
        .json({ message: "A folder with this name already exists" });
    }

    const newFolder = new Folder({
      userId,
      name,
      parentId: parentId || null,
    });

    await newFolder.save();

    res
      .status(201)
      .json({ message: "Folder created successfully", folder: newFolder });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Server error while creating folder" });
  }
};

module.exports = { getFolderContents, createFolder };
