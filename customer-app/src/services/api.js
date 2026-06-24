import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { API_URL } from "../utils/env";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("ac_customer_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["ac_customer_token", "ac_customer_user"]);
    }

    return Promise.reject(error);
  }
);

export default api;
