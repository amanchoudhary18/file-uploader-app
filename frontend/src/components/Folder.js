import { FaFolderClosed } from "react-icons/fa6";
import React from "react";

const Folder = ({ title }) => {
  return (
    <div
      className="w-[120px] text-center hover:bg-blue-50 rounded-lg"
      role="button"
    >
      <div className="flex justify-center my-auto h-[120px]">
        <FaFolderClosed size="120px" className="text-[#ff9f92] " />
      </div>
      <div className="flex justify-center">
        <p className="m-0 my-2 text-wrap break-words w-[100px] font-medium">
          {title}
        </p>
      </div>
    </div>
  );
};

export default Folder;
