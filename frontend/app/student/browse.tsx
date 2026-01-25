import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Card from "@/components/common/Card";
import { getHostels, Hostel } from "@/services/hostel.service";

export default function BrowseScreen() {
  const router = useRouter();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHostels()
      .then(setHostels)
      .catch(() => alert("Failed to load hostels"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

 return (
  <View style={styles.wrapper}>
    <FlatList
      data={hostels}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Card
          title={item.name}
          subtitle={`KES ${item.price_kes_per_month} • ${item.distance_km}km • ⭐ ${item.rating}`}
          onPress={() =>
            router.push({
              pathname: "/student/booking",
              params: {
                hostelId: item.id,
                name: item.name,
                price: item.price_kes_per_month.toString(),
              },
            })
          }
        />
      )}
    />
  </View>
);
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // ✅ REQUIRED
    backgroundColor: "#f7f8fa",
  },
  container: {
    padding: 16,
    paddingBottom: 40, // ✅ allows full scroll
  },
});

