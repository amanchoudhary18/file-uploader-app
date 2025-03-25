import React, { useContext, useState } from "react";
import { FaFolderClosed } from "react-icons/fa6";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { getFileCategory } from "../utils/getFileCategory";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { setUserData, parentId, setStorage } = useContext(UserContext);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized: Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/file/upload${
          parentId ? "?folderId=" + parentId : ""
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("File uploaded successfully!");

      const uploadedFileSize = response.data.file.size;
      const category = getFileCategory(response.data.file.type);

      setUserData((prevUserData) => ({
        ...prevUserData,
        totalUsed: prevUserData.totalUsed + uploadedFileSize,
        categories: {
          ...prevUserData.categories,
          [category]:
            (prevUserData.categories[category] || 0) + uploadedFileSize,
        },
      }));

      setStorage((prev) => ({
        ...prev,
        files: [...prev.files, response.data.file],
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFileUpload(event.dataTransfer.files[0]);
    }
  };

  const handleClick = () => document.getElementById("fileInput").click();

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      handleFileUpload(event.target.files[0]);
    }
  };

  return (
    <div className="px-5 mt-2">
      <div
        className={`border border-dashed rounded-lg bg-gray-50 border-gray-300 w-full flex justify-center 
        ${isDragging ? "bg-gray-200" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
      >
        <div className="my-16 flex flex-col justify-center text-center">
          <div className="flex justify-center relative">
            <FaFolderClosed size="100px" className="text-slate-200" />
            <div className="flex justify-center rounded-full bg-black h-8 w-8 absolute bottom-0 right-14">
              <AiOutlineCloudUpload
                color="white"
                size="20px"
                className="my-auto"
              />
            </div>
          </div>
          <p className="text-sm m-1">
            <span className="underline underline-offset-2">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs m-0 text-slate-500">Maximum file size 5 MB</p>
        </div>
      </div>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
