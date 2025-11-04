import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../components/common/Card";

export default function AdminDashboard() {
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
        <Text style={styles.welcome}>Welcome Admin 🧑‍💼</Text>
        <Text style={styles.subText}>Manage hostels efficiently.</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <Card
          title="🏠 Manage Rooms"
          subtitle="Add, edit or remove rooms."
          onPress={() => router.push("/admin/rooms")}
        />

        <Card
          title="🧾 Allocations"
          subtitle="Manage room allocations."
          onPress={() => router.push("/admin/allocations")}
        />

        <Card
          title="📊 Analytics"
          subtitle="View reports and insights."
          onPress={() => router.push("/admin/analytics")}
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
