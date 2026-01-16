import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Asset from "expo-asset";
import Papa from "papaparse";
import Card from "../../components/common/Card";

interface Hostel {
  hostel_id: string;
  name: string;
  price_kes_per_month: string;
  distance_km: string;
  facilities: string;
  rating: string;
}

export default function RecommendationsScreen() {
  const [recommendations, setRecommendations] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // ✅ Load hostel data from CSV
        const asset = Asset.Asset.fromModule(require("../../assets/data/dkut_hostels.csv"));
        await asset.downloadAsync();
        const fileContent = await FileSystem.readAsStringAsync(asset.localUri || "");
        const parsed = Papa.parse(fileContent, { header: true });
        const hostels = parsed.data as Hostel[];

        // 🧠 Basic “recommendation” logic (temporary until ML integration):
        // e.g., sort by rating and distance (closest & highest rated first)
        const sorted = hostels
          .filter((h) => h.name) // filter out empty rows
          .sort((a, b) => {
            const ratingA = parseFloat(a.rating || "0");
            const ratingB = parseFloat(b.rating || "0");
            const distA = parseFloat(a.distance_km || "999");
            const distB = parseFloat(b.distance_km || "999");
            // higher rating first, then closer distance
            if (ratingB !== ratingA) return ratingB - ratingA;
            return distA - distB;
          });

        // pick top 5 as recommendations
        setRecommendations(sorted.slice(0, 5));
      } catch (error) {
        console.error("Error loading recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6c63ff" />
        <Text>Fetching recommendations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Recommended Hostels for You</Text>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.hostel_id}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            subtitle={`Ksh ${item.price_kes_per_month} · ${item.distance_km} km · ⭐ ${item.rating}`}
            onPress={() => console.log("Selected:", item.name)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa", padding: 15 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
