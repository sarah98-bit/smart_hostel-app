import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import AuthHeader from "../../components/auth/AuthHeader";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🧠 Role detection based on email domain
const detectRoleFromEmail = (email: string): "student" | "admin" | "invalid" => {
  if (email.endsWith("@students.dkut.ac.ke")) {
    return "student";
  } else if (email.endsWith("@dkut.ac.ke")) {
    return "admin";
  } else {
    return "invalid";
  }
};
export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirm) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const role = detectRoleFromEmail(email);

    if (role === "invalid") {
      Alert.alert("❌ Registration Failed", "Please use a valid school email.");
      return;
    }

    if (role === "admin") {
      Alert.alert(
        "❌ Registration Failed",
        "Admin accounts cannot be created from the frontend."
      );
      return;
    }

    setLoading(true);

    try {
      // Send registration request to backend
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role, // automatically "student"
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const userData = data.data;

      // Save user to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      Alert.alert("✅ Account Created", `Welcome ${userData.role}`);
      router.replace("/student/dashboard");
    } catch (err: any) {
      Alert.alert("❌ Registration Failed", err.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ImageBackground
        source={require("../../assets/images/auth-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <AuthHeader
            title="Create Account 🏡"
            subtitle="Join the Smart Hostel System"
          />

          <Input
            placeholder="Username"
            icon="person-outline"
            value={username}
            onChangeText={setUsername}
          />

          <Input
            placeholder="Email (school only)"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            placeholder="Password"
            icon="lock-closed-outline"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Input
            placeholder="Confirm Password"
            icon="lock-closed-outline"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <Button
            title={loading ? "Registering..." : "Register"}
            onPress={handleRegister}
          />

          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.linkSecondary}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  content: {
    padding: 20,
    marginTop: 100,
  },
  linkSecondary: {
    textAlign: "center",
    color: "#000308",
    marginTop: 15,
  },
});