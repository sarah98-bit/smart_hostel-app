export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type Role = "STUDENT" | "ADMIN";

export interface User {
  success: any;
  message: string;
  data: any;
  id: string;
  email: string;
  role: Role;
}
