import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { createBooking } from "@/services/booking.service";

export default function BookingScreen() {
  const { hostelId, name, price } = useLocalSearchParams();
  const hostelName = typeof name === "string" ? name : name?.[0];
  const router = useRouter();
  const [loading, setLoading] = useState(false);
const handleBooking = async () => {
  if (!hostelId) {
    Alert.alert("Error", "Hostel ID missing. Please try again.");
    return;
  }

  setLoading(true);
  try {
    const booking = await createBooking(hostelId as string);

    router.push({
      pathname: "/student/payment",
      params: {
        bookingId: booking.id,          
        price: booking.price.toString(),
        hostelName: booking.hostel.name,
      },
    });
  } catch (e: any) {
    Alert.alert("Booking failed", e.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirm Booking</Text>

      <Card
        title={hostelName}
        subtitle={`Monthly Rent: KES ${typeof price === "string" ? price : price?.[0]}`}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          This action will reserve the room temporarily until payment is
          completed.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Reserve Room" onPress={handleBooking} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginVertical: 20,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
