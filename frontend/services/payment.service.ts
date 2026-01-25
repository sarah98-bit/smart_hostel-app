import api from "./api";
import { ApiResponse } from "./types";

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: "SUCCESS" | "FAILED";
  paidAt: string;
}

export const makePayment = async (
  bookingId: string,
  amount: number
): Promise<Payment> => {
  const res = await api.post<ApiResponse<Payment>>("/payments", {
    booking: bookingId,
    amount,
  });
  return res.data.data;
};
