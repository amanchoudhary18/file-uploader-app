import React, { useCallback, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "./Button";
import { FaX } from "react-icons/fa6";
import { UserContext } from "../context/UserContext";

const NewFolderModal = ({ isOpen, onClose, onFolderCreated }) => {
  const [folderName, setFolderName] = useState("");
  const { parentId } = useContext(UserContext);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/folder`,
        { name: folderName, parentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Folder created successfully!");
      onFolderCreated(response.data.folder);
      onClose();
    } catch (error) {
      toast.error("Failed to create folder. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create New Folder</h2>
          <button onClick={onClose}>
            <FaX size={20} />
          </button>
        </div>

        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
          className={`w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
        />

        <div className="flex justify-end space-x-3 mt-4">
          <div className="flex justify-end mt-4">
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFolderModal;
