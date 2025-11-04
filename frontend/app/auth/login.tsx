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

// Helper to check if input is email
const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

// Helper to validate DKUT email
const isValidSchoolEmail = (email: string) => {
  return (
    email.endsWith("@students.dkut.ac.ke") || email.endsWith("@dkut.ac.ke")
  );
};

// Mock login
const mockLogin = async (identifier: string, password: string) => {
  const isUserEmail = isEmail(identifier);

  if (isUserEmail && !isValidSchoolEmail(identifier)) {
    throw new Error("Please use a valid DKUT school email address");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Determine role
  let role = "student";
  if (isUserEmail && identifier.endsWith("@dkut.ac.ke")) {
    role = "admin";
  }

  return { identifier, role };
};

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await mockLogin(identifier, password);
      Alert.alert("✅ Login Successful", `Welcome ${user.role}!`);

      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    } catch (err: any) {
      Alert.alert("❌ Login Failed", err.message || "Invalid credentials");
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

          <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} />

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
    backgroundColor: "rgba(238, 241, 238, 0.45)",
  },
  content: { padding: 20, justifyContent: "center" },
  link: {
    color: "#6c63ff",
    textAlign: "center",
    marginVertical: 10,
  },
  linkSecondary: {
    textAlign: "center",
    color: "#fff",
    marginTop: 5,
  },
});
