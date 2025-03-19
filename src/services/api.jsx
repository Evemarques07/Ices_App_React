import axios from "axios";

const api = axios.create({
  baseURL: "http://3.14.145.145:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
