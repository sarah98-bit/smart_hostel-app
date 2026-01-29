import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ?? "http://10.0.2.2:5000/api";

if (!API_URL) throw new Error("API_URL is not defined");

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ------------------
// REQUEST INTERCEPTOR
// ------------------
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    // ⚡ TS-safe: ensure headers exist
    config.headers = config.headers ?? {};
    if (token) {
      // ✅ Add Authorization safely
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    return config; // returning config is enough, no extra Promise wrapping
  },
  (error) => Promise.reject(error)
);

// ------------------
// RESPONSE INTERCEPTOR
// ------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Check your connection.")
      );
    }

    if (error.response.status === 401) {
      await AsyncStorage.multiRemove(["token", "user"]);
      router.replace("/auth/login");
    }

    return Promise.reject(
      error.response.data?.message ||
        error.response.data ||
        error.message ||
        "Something went wrong"
    );
  }
);

export default api;
