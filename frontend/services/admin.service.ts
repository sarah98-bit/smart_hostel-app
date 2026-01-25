import api from "./api";
import { ApiResponse } from "./types";
import { Booking } from "./booking.service";

export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await api.get<ApiResponse<Booking[]>>("/admin/bookings");
  return res.data.data;
};
