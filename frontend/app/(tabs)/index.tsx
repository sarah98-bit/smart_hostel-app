import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // 🔐 Later we'll add a check for saved auth token
    // If logged in, route to dashboard automatically
    // e.g., router.replace('/student/dashboard');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Smart Hostel App</Text>
      <Text style={styles.subtitle}>Comfortable living made smarter ✨</Text>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => router.replace("/auth/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => router.replace("/auth/register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "80%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  loginButton: {
    backgroundColor: "#6c63ff",
  },
  registerButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
