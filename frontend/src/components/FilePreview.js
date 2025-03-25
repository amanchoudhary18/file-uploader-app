import React, { useState } from "react";
import { FaX } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import Button from "./Button";
import Loader from "./Loader";

const FilePreview = ({ file, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  if (!file) return null;

  const handleDownload = () => {
    window.open(file.url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 md:w-3/5 lg:w-2/5 relative animate-fadeIn">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            {file.name}
          </h2>
          <button onClick={onClose}>
            <FaX size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto border rounded-lg p-4 bg-gray-100 mt-4">
          {file.type.startsWith("image/") ? (
            <>
              {!imageLoaded && <Loader />}
              <img
                src={file.url}
                alt={file.name}
                className={`max-w-full mx-auto rounded-lg shadow-sm transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : file.type.startsWith("text/") ? (
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-3 bg-gray-50 border border-gray-300 rounded-md shadow-inner">
              {file.content}
            </pre>
          ) : file.type === "application/json" ? (
            <pre className="whitespace-pre-wrap text-sm font-mono text-green-400 p-3 bg-gray-900 border border-gray-700 rounded-md shadow-inner">
              {JSON.stringify(file.content, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500 italic">Unsupported file format</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleDownload} icon={<FaDownload />}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
