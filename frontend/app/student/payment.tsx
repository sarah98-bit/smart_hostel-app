import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { makePayment, PaymentResponse } from "@/services/payment.service";
import { getProfile } from "@/services/profile.service";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const bookingId = params.bookingId as string;
  const hostelName = params.hostelName as string;
  const price = Number(params.price);

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Load userId from AsyncStorage instead of params
        const raw = await AsyncStorage.getItem("user");
        if (!raw) throw new Error("Not logged in");
        const user = JSON.parse(raw);
        const userId = user.id;

        const profile = await getProfile(userId);
        setPhone(profile.phone);
      } catch (error) {
        Alert.alert(
          "Profile Missing",
          "Please complete your profile before making payments."
        );
        router.replace("/student/profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePayment = async () => {
    if (!phone) {
      Alert.alert("Phone Number Missing", "Your phone number is not registered.");
      return;
    }

    setLoading(true);

    try {
      const payment: PaymentResponse = await makePayment(bookingId, price);

      if (payment.success) {
        Alert.alert(
          "Payment Initiated",
          "You will receive an M-Pesa prompt on your phone. Complete the payment to confirm your booking.",
          [{ text: "OK", onPress: () => router.replace("/student/dashboard") }]
        );
        console.log("STK Push CheckoutRequestID:", payment.checkoutRequestId);
      } else {
        Alert.alert("Payment Failed", payment.message || "Payment could not be processed");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      Alert.alert(
        "Payment Error",
        error.message || "Something went wrong while processing your payment."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>

      <Card title={hostelName} subtitle={`Amount: KES ${price}`} />

      <View style={styles.paymentBox}>
        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.method}>M-Pesa (STK Push)</Text>
        <Text style={styles.note}>
          You will receive a prompt on your phone to authorize the payment.
        </Text>
      </View>

      <View style={styles.phoneBox}>
        <Text style={styles.label}>Payment Phone Number</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Pay Now" onPress={handlePayment} />
      )}

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f7f8fa" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: "#222" },
  paymentBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    elevation: 2,
  },
  phoneBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: { fontSize: 14, color: "#666", marginBottom: 6 },
  method: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  phone: { fontSize: 18, fontWeight: "600", color: "#222" },
  note: { fontSize: 13, color: "#999" },
  cancel: { textAlign: "center", color: "#999", marginTop: 16, fontSize: 14 },
});