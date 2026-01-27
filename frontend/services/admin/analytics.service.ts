import api from "../api";

export interface Analytics {
  totalStudents: number;
  totalRooms: number;
  occupiedRooms: number;
  revenue: number;
}

export const getAnalytics = async (): Promise<Analytics> => {
  try {
    const res = await api.get<Analytics>("/admin/analytics");

    // ✅ Explicitly return typed data
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to load analytics");
  }
};
