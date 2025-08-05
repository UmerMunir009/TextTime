import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isCheckingAuth, setCheckingAuth] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [signingUp, setSigningUp] = useState(false);
  const [logging, setLogging] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [onlineUsers,setOnlineUsers]=useState([])

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/checkAuth");
      setAuthUser(response.data);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setCheckingAuth(false);
    }
  };
  const signUp = async (formData) => {
    try {
      setSigningUp(true);
      const response = await axiosInstance.post("/auth/sign-up", formData);
      setAuthUser(response.data);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setSigningUp(false);
    }
  };

  const Login = async (formData) => {
    try {
      setLogging(true);
      const response = await axiosInstance.post("/auth/login", formData);
      setAuthUser(response.data);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setLogging(false);
    }
  };

  const Logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      toast.success(response.data.message);
      localStorage.removeItem("token");
      setAuthUser(null);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setLogging(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      setUpdatingProfile(true)
      const response = await axiosInstance.put(
        "/auth/update-profile",
        formData,{  headers: { "Content-Type": "multipart/form-data" },}
      );
      toast.success(response.data.message);
      setAuthUser(response.data);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setUpdatingProfile(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signingUp,
        signUp,
        logging,
        Login,
        Logout,
        isCheckingAuth,
        authUser,
        updateProfile,
        updatingProfile,
        onlineUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
