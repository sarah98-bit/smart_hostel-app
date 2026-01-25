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

// ✅ FIXED interceptor
api.interceptors.request.use(
  (async (config: any) => {
    const token = await AsyncStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }) as any,
  (error: any) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      throw new Error("Network error. Check your connection.");
    }

    if (error.response.status === 401) {
      await AsyncStorage.multiRemove(["token", "user"]);
      router.replace("/auth/login");
    }

    throw new Error(
      error.response.data?.message || "Something went wrong"
    );
  }
);

console.log("API URL:", API_URL);

export default api;
