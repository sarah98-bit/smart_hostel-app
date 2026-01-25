import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../components/common/Card";

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header image */}
      <Image
        source={require("../../assets/images/auth-bg.png")}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.welcome}>Welcome Back 🎓</Text>
        <Text style={styles.subText}>Manage your hostel life easily.</Text>
      </View>

      {/* Cards */}
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
          title="🧑🏼 Profile"
          subtitle="View profile."
          onPress={() => router.push("/student/profile")}
        />

        {/* New Booking Card */}
        <Card
          title="📖 Book Room"
          subtitle="Reserve your preferred room now."
          onPress={() => router.push("/student/booking")}
        />

        {/* New Payment Card */}
        <Card
          title="💳 Make Payment"
          subtitle="Pay for your room securely."
          onPress={() => router.push("/student/payment")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30, backgroundColor: "#f7f8fa" },
  headerImage: { width: "100%", height: 200 },
  overlay: { position: "absolute", top: 80, left: 20 },
  welcome: { fontSize: 26, color: "#fff", fontWeight: "bold" },
  subText: { fontSize: 16, color: "#eee" },
  cardContainer: { padding: 20 },
});
