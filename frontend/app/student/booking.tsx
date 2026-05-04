import React, { useState, useEffect } from "react";
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
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Properly extract parameters, handling both string and array cases
  const hostelId = typeof params.hostelId === "string" 
    ? params.hostelId 
    : Array.isArray(params.hostelId) && params.hostelId.length > 0
    ? params.hostelId[0]
    : null;
  
  const hostelName = typeof params.name === "string" 
    ? params.name 
    : Array.isArray(params.name) && params.name.length > 0
    ? params.name[0]
    : "Unknown Hostel";
  
  const price = typeof params.price === "string" 
    ? params.price 
    : Array.isArray(params.price) && params.price.length > 0
    ? params.price[0]
    : "0";

  // Debug logging to see what we're receiving
  useEffect(() => {
    console.log("=== Booking Screen Debug ===");
    console.log("Raw params:", params);
    console.log("Extracted values:", {
      hostelId,
      hostelName,
      price
    });
    console.log("hostelId type:", typeof hostelId);
    console.log("hostelId value:", hostelId);
    console.log("===========================");
  }, [params]);

  const handleBooking = async () => {
    console.log("handleBooking called with hostelId:", hostelId);
    
    if (!hostelId) {
      console.error("Hostel ID is missing or undefined:", { 
        hostelId, 
        rawParams: params,
        hostelIdType: typeof hostelId
      });
      Alert.alert("Error", "Hostel ID missing. Please try again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Calling createBooking with:", hostelId);
      const booking = await createBooking(hostelId);
      console.log("Booking created successfully:", booking);

      router.push({
        pathname: "/student/payment",
        params: {
          bookingId: String(booking.id),
          price: String(booking.price),
          hostelName: booking.hostel?.name || hostelName,
        },
      });
    } catch (e: any) {
      console.error("Booking error:", e);
      Alert.alert("Booking failed", e.message || "An error occurred");
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
          title={hostelName || "Unknown Hostel"}
          subtitle={`Monthly Rent: KES ${price}`}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This action will reserve the room temporarily until payment is
            completed.
          </Text>
        </View>

        {/* Debug info (remove in production) */}
        {__DEV__ && (
          <View style={styles.debugBox}>
            <Text style={styles.debugText}>Debug Info:</Text>
            <Text style={styles.debugText}>Hostel ID: {hostelId || "NULL"}</Text>
            <Text style={styles.debugText}>Name: {hostelName}</Text>
            <Text style={styles.debugText}>Price: {price}</Text>
          </View>
        )}

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
  debugBox: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  debugText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "monospace",
  },
});