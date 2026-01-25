import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking } from "./booking.service";

const KEY = "active_booking";

export const saveBooking = async (booking: Booking) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(booking));
};

export const getBooking = async (): Promise<Booking | null> => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const clearBooking = async () => {
  await AsyncStorage.removeItem(KEY);
};
