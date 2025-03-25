import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import CloudStorage from "../components/CloudStorage";
import Storage from "../components/Storage";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(response.data);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Storage />
      <FileUpload />
      <CloudStorage />
    </div>
  );
};

export default Home;
