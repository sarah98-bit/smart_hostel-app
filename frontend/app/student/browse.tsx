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

export default function RoomBrowseScreen() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const asset = Asset.Asset.fromModule(require("../../assets/images/dkut-hostels.csv"));
        await asset.downloadAsync();
        const fileContent = await FileSystem.readAsStringAsync(asset.localUri || "");
        const parsed = Papa.parse(fileContent, { header: true });
        setHostels(parsed.data as Hostel[]);
      } catch (error) {
        console.error("Error loading CSV:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCSV();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6c63ff" />
        <Text>Loading Hostels...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Hostels</Text>
      <FlatList
        data={hostels}
        keyExtractor={(item) => item.hostel_id}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            subtitle={`Ksh ${item.price_kes_per_month} · ${item.distance_km} km`}
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
