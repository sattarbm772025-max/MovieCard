import axios from "axios";

const isLocalFrontend =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (
      isLocalFrontend
        ? "http://127.0.0.1:8000"
        : "https://moviecard-fr7a.onrender.com"
    ),
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
