import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Card from "@/components/common/Card";

export default function RecommendationsScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams();

  const recommendations = data ? JSON.parse(data as string) : [];

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f8fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#222",
  },
  cardWrapper: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 15,
  },
});
