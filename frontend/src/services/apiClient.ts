import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000", // Backend Node.js
  withCredentials: true,
});

export default apiClient;
