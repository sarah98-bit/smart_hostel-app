import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

type PaymentParams = {
  name?: string;
  price?: string;
};

export default function PaymentScreen() {
  const router = useRouter();
  const { name, price } = useLocalSearchParams<PaymentParams>();

  // Defensive guards (CRITICAL)
  if (!name || !price) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Invalid or missing payment details.</Text>

        <Button
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Mock payment (replace with real API / MPesa STK Push)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Payment Successful",
        "Your room has been booked successfully."
      );

      // Navigate OUTSIDE Alert (Android-safe)
      setTimeout(() => {
        router.replace("/student/dashboard");
      }, 300);
    } catch (error) {
      Alert.alert("Payment Failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>

      <Card
        title={name}
        subtitle={`Amount: KES ${price} per month`}
      />

      <View style={styles.paymentBox}>
        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.method}>M-Pesa (Recommended)</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Pay Now" onPress={handlePayment} />
      )}

      <TouchableOpacity
        disabled={loading}
        onPress={() => router.back()}
      >
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f8fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  paymentBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  method: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancel: {
    textAlign: "center",
    color: "#999",
    marginTop: 15,
  },
  error: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
});
