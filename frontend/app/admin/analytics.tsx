import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import {
  getAnalytics,
  Analytics,
} from "../../services/admin/analytics.service";

export default function AnalyticsScreen() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalytics();
        setData(res);
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    };

    load();
  }, []);

  if (!data) return null;

  return (
    <View style={styles.container}>
      <Text>Total Students: {data.totalStudents}</Text>
      <Text>Total Rooms: {data.totalRooms}</Text>
      <Text>Occupied Rooms: {data.occupiedRooms}</Text>
      <Text>Revenue: KES {data.revenue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
