import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../components/common/Card";

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header with image and welcome text */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/auth-bg.png")}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.welcome}>Welcome Back 🎓</Text>
          <Text style={styles.subText}>Manage your hostel life easily.</Text>
        </View>
      </View>

      {/* Dashboard container with JPEG background image and overlay */}
      <ImageBackground
        source={require("../../assets/images/dashboard-bg.jpeg")} // Updated to JPEG
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay for darkening the background */}
        <View style={styles.overlay} />

        {/* Cards on top of overlay */}
        <View style={styles.cardContainer}>
          <Card
            title="🏠 Browse Hostels"
            subtitle="View available hostels and book your room."
            onPress={() => router.push("/student/browse")}
          />

          <Card
            title="⚙️ Set Preferences"
            subtitle="Personalize your recommendations."
            onPress={() => router.push("/student/preferences")}
          />

          <Card
            title="🤖 Recommendations"
            subtitle="See rooms recommended for you."
            onPress={() => router.push("/student/recommendations")}
          />

          <Card
            title="📖 Book Room"
            subtitle="Reserve your preferred room now."
            onPress={() => router.push("/student/booking")}
          />

          <Card
            title="💳 Make Payment"
            subtitle="Pay for your room securely."
            onPress={() => router.push("/student/payment")}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  welcome: { fontSize: 26, color: "#fff", fontWeight: "bold" },
  subText: { fontSize: 16, color: "#eee" },
  background: {
    flex: 1,
    width: "100%",
    paddingVertical: 20,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills entire ImageBackground
    backgroundColor: "rgba(0, 0, 0, 0.64)", // semi-transparent dark overlay
  },
  cardContainer: {
    paddingHorizontal: 20,
    position: "relative", // so cards appear on top of overlay
  },
});
