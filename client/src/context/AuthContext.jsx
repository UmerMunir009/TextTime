import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { io } from "socket.io-client";
import { authStore } from "../store/authStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setAuthUser, setSocket, setOnlineUsers,socket } = authStore();
  const [isCheckingAuth, setCheckingAuth] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [logging, setLogging] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/checkAuth");
      setAuthUser(response.data);
      connectSocket(response.data.data.id); //on refresh,user disconneted from socket so if authenticated then connected again to socket
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
      connectSocket(response.data.data.id); //connecting to the socket right after sign-up
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
      connectSocket(response.data.data.id); //connecting to the socket right after the login
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
      disconnectSocket(); //disconnecting right after the logout
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
      setUpdatingProfile(true);
      const response = await axiosInstance.put(
        "/auth/update-profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
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

  const connectSocket = (id) => {
    const socketInstance = io(import.meta.env.VITE_BASE_URL, {
      query: {
        userId: id,
      },
    });
    socketInstance.connect();
    setSocket(socketInstance);

    socketInstance.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds); 
    });
  };
  const disconnectSocket = () => {
    socket.disconnect();
    socket.on('getOnlineUsers',(userIds)=>{
      setOnlineUsers(userIds)
    })
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
        updateProfile,
        updatingProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
