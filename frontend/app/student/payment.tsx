import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { makePayment, PaymentResponse } from "@/services/payment.service";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const bookingId = params.bookingId as string;
  const hostelName = params.hostelName as string;
  const price = Number(params.price);

  const [phone, setPhone] = useState(""); // User's M-Pesa phone number
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!phone) {
      Alert.alert("Phone Number Required", "Please enter your M-Pesa phone number.");
      return;
    }

    setLoading(true);

    try {
      const payment: PaymentResponse = await makePayment(bookingId, phone, price);

      // If backend says success, show alert
      if (payment.success) {
        Alert.alert(
          "Payment Initiated",
          "You will receive an M-Pesa prompt on your phone. Complete the payment to confirm your booking.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/student/dashboard"),
            },
          ]
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

      <TextInput
        style={styles.input}
        placeholder="Enter M-Pesa Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

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
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f8fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
  },
  paymentBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  method: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  note: {
    fontSize: 13,
    color: "#999",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancel: {
    textAlign: "center",
    color: "#999",
    marginTop: 16,
    fontSize: 14,
  },
});
