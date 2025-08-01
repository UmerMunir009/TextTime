import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setCheckingAuth] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/checkAuth");
      setAuthUser(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isCheckingAuth, authUser }}>
      {children}
    </AuthContext.Provider>
  );
};
