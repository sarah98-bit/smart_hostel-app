import axios from "axios";

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
  MPESA_CALLBACK_URL,
} = process.env;

const AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const STK_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

/**
 * Get access token from Safaricom
 */
export const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
  const res = await axios.get(AUTH_URL, { headers: { Authorization: `Basic ${auth}` } });
  return res.data.access_token;
};

/**
 * Format phone number to international format (254...)
 */
const formatPhone = (phone: string) => {
  if (phone.startsWith("0")) return "254" + phone.slice(1);
  if (phone.startsWith("+")) return phone.slice(1);
  return phone;
};

/**
 * Initiate STK Push
 */
export const stkPush = async (phone: string, amount: number, bookingId: string) => {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.max(amount, 1),
    PartyA: formatPhone(phone),
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: formatPhone(phone),
    CallBackURL: MPESA_CALLBACK_URL,
    AccountReference: bookingId,
    TransactionDesc: "Hostel Booking Payment",
  };

  try {
    const res = await axios.post(STK_URL, payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    console.error("MPESA ERROR:", error.response?.data || error.message);
    throw error;
  }
};
