import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { LuFileJson2 } from "react-icons/lu";
import { FaFileImage } from "react-icons/fa";

const icon = {
  document: <FaFileAlt size={"100px"} className="text-blue-400 my-auto" />,
  json: <LuFileJson2 size={"100px"} className="text-yellow-400 my-auto" />,
  image: <FaFileImage size={"100px"} className="text-green-400 my-auto" />,
};

const File = ({ title, type }) => {
  return (
    <div
      className="w-[120px] text-center rounded-lg hover:bg-blue-50"
      role="button"
    >
      <div className="flex justify-center align-middle h-[120px]">
        {icon[type]}
      </div>
      <div className="flex justify-center">
        <p className="m-0 my-2 text-wrap break-words w-[100px] font-medium">
          {title}
        </p>
      </div>
    </div>
  );
};

export default File;
