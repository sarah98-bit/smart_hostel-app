import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined");
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config: any) => {
    const token = await AsyncStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Network or server not reachable
      return Promise.reject(new Error("Network error. Check your connection."));
    }

    // 401: Unauthorized
    if (error.response.status === 401) {
      await AsyncStorage.multiRemove(["token", "user"]);
      router.replace("/auth/login");
    }

    // Forward backend error to frontend instead of generic message
    return Promise.reject(error.response.data || error.message || "Something went wrong");
  }
);

console.log("API URL:", API_URL);

export default api;
