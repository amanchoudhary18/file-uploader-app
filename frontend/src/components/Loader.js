import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
