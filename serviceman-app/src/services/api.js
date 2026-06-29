import axios from "axios";
import { Platform } from "react-native";

const getApiBaseUrl = () => {
  if (Platform.OS === "web") {
    const host =
      typeof window !== "undefined" && window.location.hostname
        ? window.location.hostname
        : "localhost";
    return `http://${host}:5000/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }

  return "http://localhost:5000/api";
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export default api;
