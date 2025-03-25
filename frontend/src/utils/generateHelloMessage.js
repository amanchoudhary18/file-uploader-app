import { GoSun } from "react-icons/go";
import { WiSunrise } from "react-icons/wi";
import { FaCloudMoon } from "react-icons/fa6";

const salutations = {
  morning: {
    message: "Good Morning",
    icon: <WiSunrise className="text-blue-500" size={"35px"} />,
  },
  afternoon: {
    message: "Good Afternoon",
    icon: <GoSun className="text-orange-500" size={"25px"} />,
  },

  evening: {
    message: "Good Evening",
    icon: <FaCloudMoon className="text-blue-700" size={"25px"} />,
  },
};

export const generateHelloMessage = () => {
  const hours = new Date().getHours();
  if (hours >= 0 && hours < 12) {
    return salutations.morning;
  } else if (hours >= 12 && hours < 16) {
    return salutations.afternoon;
  } else {
    return salutations.evening;
  }
};
