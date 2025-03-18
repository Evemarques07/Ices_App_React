import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.83:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;