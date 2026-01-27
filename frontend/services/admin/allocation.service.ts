import api from "../api";

export const getConfirmedBookings = async () => {
  try {
    const res = await api.get("/admin/bookings/confirmed");
    return res.data;
  } catch (error: any) {
    throw new Error("Failed to fetch confirmed bookings");
  }
};

export const allocateRoom = async (bookingId: string) => {
  try {
    const res = await api.post(`/admin/allocate/${bookingId}`);
    return res.data;
  } catch (error: any) {
    throw new Error("Room allocation failed");
  }
};
