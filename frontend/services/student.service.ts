import api from "./api";
import { ApiResponse, User } from "./types";

export const getStudentProfile = async (): Promise<User> => {
  const res = await api.get<ApiResponse<User>>("/students/profile");
  return res.data.data;
};
