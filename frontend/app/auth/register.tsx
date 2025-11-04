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

// Temporary mock register function (replace with backend API later)
const mockRegister = async (username: string, email: string, password: string) => {
  const role = detectRoleFromEmail(email);
  if (role === "invalid") {
    throw new Error("Invalid email domain. Use your school email.");
  }
  return { username, email, role };
};

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirm) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userData = await mockRegister(username, email, password);

      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      Alert.alert("✅ Account Created", `Welcome ${userData.role}`);
      if (userData.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    padding: 20,
    marginTop: 100,
  },
  linkSecondary: {
    textAlign: "center",
    color: "#fff",
    marginTop: 15,
  },
});
