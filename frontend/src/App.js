import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthForm from "./pages/AuthForm";
import Home from "./pages/Home";
import { UserProvider } from "./context/UserContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <AuthForm isSignUp={true} />,
  },
  {
    path: "/login",
    element: <AuthForm isSignUp={false} />,
  },
  {
    path: "*",
    element: <Home />,
  },
]);

function App() {
  return (
    <div>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
