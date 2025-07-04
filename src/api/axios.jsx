import axios from "axios";

const instance = axios.create({
  baseURL: "https://vercel-backend-lone.onrender.com/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
