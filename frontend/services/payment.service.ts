import api from "./api";

export interface PaymentResponse {
  checkoutRequestId: string;
  message: string;
  success: boolean;
}

export const makePayment = async (
  bookingId: string,
  phone: string,
  amount: number
): Promise<PaymentResponse> => {
  try {
    const res = await api.post<PaymentResponse>("/payments/stk-push", {
      bookingId,
      phone,
      amount,
    });

    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Payment failed");
    }

    return data; // <<< return the object directly
  } catch (error: any) {
    console.error("Payment Service Error:", error);
    throw new Error(error.message || "Payment initiation failed");
  }
};
