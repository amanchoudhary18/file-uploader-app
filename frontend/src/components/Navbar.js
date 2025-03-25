import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { generateHelloMessage } from "../utils/generateHelloMessage";
import Button from "./Button";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { setUserData, setParentId } = useContext(UserContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("parentId");
    localStorage.removeItem("breadcrumbs");
    setUserData(null);
    setParentId(null);
    navigate("/login");
  };

  const salutation = generateHelloMessage();

  return (
    <nav className="flex justify-between py-3 px-5 align-middle border-b-2">
      <div className="flex gap-2">
        <h1 className="text-xl font-bold my-auto">
          {salutation?.message}, Aman!
        </h1>
        <div className="my-auto">{salutation?.icon}</div>
      </div>

      <Button onClick={logoutHandler} icon={<FaSignOutAlt />}>
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;
