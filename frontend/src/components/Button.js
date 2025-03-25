import React from "react";

const Button = ({ children, icon, className, ...rest }) => {
  return (
    <button
      className={`border bg-white px-3 py-2 rounded-lg flex gap-2 justify-center align-middle hover:bg-black hover:text-white ${
        className ? className : ""
      } transition duration-300`}
      {...rest}
    >
      {icon && <div className="my-auto">{icon}</div>}
      {children}
    </button>
  );
};

export default Button;
