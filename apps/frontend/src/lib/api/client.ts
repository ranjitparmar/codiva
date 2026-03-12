import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    // never auto-redirect on auth endpoints — login wrong password,
    // forgot-password, reset-password all return 401/400 legitimately
    const isAuthEndpoint = url.includes("/auth/");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      Cookies.remove("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;