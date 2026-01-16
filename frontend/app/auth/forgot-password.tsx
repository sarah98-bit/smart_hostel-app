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

// 🧠 Check valid school email domain
const isValidSchoolEmail = (email: string) => {
  return (
    email.endsWith("@students.dkut.ac.ke") || email.endsWith("@dkut.ac.ke")
  );
};

// Temporary mock reset function
const mockSendResetLink = async (email: string) => {
  if (!isValidSchoolEmail(email)) {
    throw new Error("Use a valid DKUT school email address");
  }
  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { message: "Password reset link sent to your email." };
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await mockSendResetLink(email);
      Alert.alert("✅ Success", res.message);
      router.push("/auth/login");
    } catch (err: any) {
      Alert.alert("❌ Failed", err.message || "Something went wrong");
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
            title="Forgot Password 🔐"
            subtitle="Enter your DKUT email to reset your password"
          />

          <Input
            placeholder="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
          />

          <Button
            title={loading ? "Sending..." : "Send Reset Link"}
            onPress={handleReset}
          />

          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.linkSecondary}>Back to Login</Text>
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
    backgroundColor: "rgba(19, 19, 19, 0.4)",
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
