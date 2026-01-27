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
import { useRouter } from "expo-router";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import AuthHeader from "@/components/auth/AuthHeader";
import { login } from "@/services/auth.service";
import { useAuthContext } from "@/context/AuthContext";

// Helpers (KEEP)
const isEmail = (text: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

const isValidSchoolEmail = (email: string) =>
  email.endsWith("@students.dkut.ac.ke") ||
  email.endsWith("@dkut.ac.ke");

export default function LoginScreen() {
  const router = useRouter();
  const { loginUser } = useAuthContext();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Optional DKUT email validation
    if (isEmail(identifier) && !isValidSchoolEmail(identifier)) {
      Alert.alert("Invalid Email", "Please use a valid DKUT email address");
      return;
    }

    setLoading(true);

    try {
      // 🔐 REAL BACKEND LOGIN
      const user = await login(identifier, password);

      // 🔑 CRITICAL: update global auth state
      loginUser(user);

      // Role-based redirect
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
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
            title="Welcome Back 👋"
            subtitle="Login to your Smart Hostel account"
          />

          <Input
            placeholder="Email or Username"
            icon="person-outline"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
          />

          <Input
            placeholder="Password"
            icon="lock-closed-outline"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
          />

          <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.linkSecondary}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  background: { flex: 1, justifyContent: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  content: { padding: 20, justifyContent: "center" },
  link: {
    color: "#6c63ff",
    textAlign: "center",
    marginVertical: 10,
  },
  linkSecondary: {
    textAlign: "center",
    color: "hsl(0, 24%, 96%)",
    marginTop: 5,
  },
});
