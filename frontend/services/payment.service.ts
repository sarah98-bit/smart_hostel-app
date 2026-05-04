import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PaymentResponse {
  checkoutRequestId: string;
  message: string;
  success: boolean;
}

export const makePayment = async (
  bookingId: string,
  amount: number
): Promise<PaymentResponse> => {
  try {
    // ✅ Get phone from AsyncStorage directly — don't rely on params
    const raw = await AsyncStorage.getItem("user");
    if (!raw) throw new Error("Not logged in");
    const user = JSON.parse(raw);
    const userId = user.id;

    // ✅ Fetch profile to get phone
    const profileRes = await api.get(`/profiles/${userId}`);
    const phone = profileRes.data?.data?.phone;

    if (!phone) throw new Error("Phone number not found in profile");

    const res = await api.post<{ success: boolean; message: string; checkoutRequestId: string }>(
      "/payments/stk-push",
      { bookingId, amount, phone }
    );

    const data = res.data;
    if (!data.success) throw new Error(data.message || "Payment failed");
    return data;

  } catch (error: any) {
    // ✅ Handle both plain string rejections (from api.ts interceptor) and Error objects
    const message =
      typeof error === "string"
        ? error
        : error?.message || "Payment initiation failed";

    console.error("Payment Service Error:", message);
    throw new Error(message);
  }
};