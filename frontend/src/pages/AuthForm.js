import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthForm = ({ isSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (isSignUp && !formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = isSignUp
      ? `${process.env.REACT_APP_BACKEND_URL}/auth/register`
      : `${process.env.REACT_APP_BACKEND_URL}/auth/login`;

    try {
      const response = await axios.post(url, formData);

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-10">
          {isSignUp ? (
            <div>
              <p className="m-0 font-bold">Hello, there!</p>
              <div className="m-0 text-slate-400 text-sm my-1 font-normal">
                Let's intoduce you to cloud storage
              </div>
            </div>
          ) : (
            <div>
              <p className="m-0 font-bold">Welcome Back!</p>
              <div className="m-0 text-slate-400 text-sm my-1 font-normal">
                Have some files for us to store?
              </div>
            </div>
          )}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="transition-opacity duration-300">
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-400"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-400"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-400"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-black transition"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              isSignUp ? navigate("/login") : navigate("/signup")
            }
            className="underline text-black hover:text-gray-700 transition"
          >
            {isSignUp ? "Login here" : "Sign up here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
