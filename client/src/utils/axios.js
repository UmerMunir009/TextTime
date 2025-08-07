import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 
  withCredentials: true, // for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
