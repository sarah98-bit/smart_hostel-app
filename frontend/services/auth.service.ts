import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, User } from "./types";

interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
    email, // ✅ MATCHES BACKEND
    password,
  });

  const { token, user } = res.data.data;

  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await api.post<ApiResponse<User>>("/auth/register", {
    email,
    password,
  });

  return res.data.data;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.multiRemove(["token", "user"]);
};
