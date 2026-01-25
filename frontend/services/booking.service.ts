import api from "./api";
import { ApiResponse } from "./types";

export interface Booking {
    id: string | number | (string | number)[] | null | undefined;
    hostel: any;
    roomId: string;
    hostelName: string;
    price: number;
    status: "PENDING" | "APPROVED";
    createdAt: string;
}

export const createBooking = async (hostelId: string) => {
  if(!hostelId)  {
    throw new Error("Hostel ID missing")
  }
  const res = await api.post<ApiResponse<Booking>>("/bookings", { hostelId });
  return res.data.data;
};
