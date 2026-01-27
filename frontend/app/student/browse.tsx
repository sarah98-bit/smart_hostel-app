import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, ImageBackground } from "react-native";
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
    <ImageBackground
      source={require("../../assets/images/dashboard-bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay */}
      <View style={styles.overlay} />

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
    backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent dark overlay
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
});
