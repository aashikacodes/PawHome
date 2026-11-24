// All API calls use this one Axios instance
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // our Express backend
});

// Before every request, attach the login token (if the user is logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gets a readable error message from an Axios error
export const getError = (error) =>
  error.response?.data?.message || "Something went wrong. Is the backend running?";

export default api;
