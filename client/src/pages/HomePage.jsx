import React from "react";
import { useAuth } from "./../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { Logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout =async () => {
    await Logout();
    navigate("/login");
  };

  return (
    <div className="text-white flex justify-center items-center min-h-screen">
      <button
        to={"/sign-up"}
        className="bg-red-500 px-6 py-3 rounded cursor-pointer hover:bg-red-600 transition"
        onClick={handleLogout}
      >
        LogOut
      </button>
    </div>
  );
};

export default HomePage;
