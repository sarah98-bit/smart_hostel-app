import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
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
    <ImageBackground
      source={require("../../assets/images/dashboard-bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Confirm Booking</Text>

        <Card
          title={hostelName}
          subtitle={`Monthly Rent: KES ${
            typeof price === "string" ? price : price?.[0]
          }`}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This action will reserve the room temporarily until payment is
            completed.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Button title="Reserve Room" onPress={handleBooking} />
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    position: "relative",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#fff",
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
