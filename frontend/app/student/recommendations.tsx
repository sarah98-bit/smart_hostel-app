import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Card from "@/components/common/Card";

export default function RecommendationsScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams();

  const recommendations = data ? JSON.parse(data as string) : [];

  return (
    <ImageBackground
      source={require("../../assets/images/dashboard-bg.jpeg")} // JPEG background
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay */}
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Recommended Hostels</Text>

        {recommendations.length === 0 ? (
          <Text style={styles.emptyText}>No recommendations found.</Text>
        ) : (
          recommendations.map((hostel: any) => (
            <TouchableOpacity
              key={hostel.id}
              style={styles.cardWrapper}
              onPress={() =>
                router.push({
                  pathname: "/student/booking",
                  params: {
                    hostelId: hostel.id,
                    name: hostel.name,
                    price: hostel.price_kes_per_month.toString(),
                  },
                })
              }
            >
              <Card
                title={hostel.name}
                subtitle={`KES ${hostel.price_kes_per_month} • ${hostel.distance_km} km`}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent overlay
  },
  container: {
    flexGrow: 1,
    padding: 20,
    position: "relative", // ensures content is above overlay
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#fff", // white for readability over overlay
  },
  cardWrapper: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#ddd", // lighter color for overlay
    marginTop: 40,
    fontSize: 15,
  },
});
