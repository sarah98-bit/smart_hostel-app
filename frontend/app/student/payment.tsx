import React, { useState } from "react";
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
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { makePayment } from "@/services/payment.service";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const bookingId = params.bookingId as string;
  const hostelName = params.hostelName as string;
  const price = params.price as string;

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await makePayment(bookingId, Number(price));

      Alert.alert(
        "Payment Successful",
        "Your room has been booked successfully.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/student/dashboard"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Payment Failed", error.message || "Payment could not be processed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>

      <Card
        title={hostelName}
        subtitle={`Amount: KES ${price}`}
      />

      <View style={styles.paymentBox}>
        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.method}>M-Pesa (Simulated)</Text>
        <Text style={styles.note}>
          This is a mock payment. No real transaction is performed.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
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
  cancel: {
    textAlign: "center",
    color: "#999",
    marginTop: 16,
    fontSize: 14,
  },
});
