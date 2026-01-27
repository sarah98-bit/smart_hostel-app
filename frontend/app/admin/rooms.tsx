import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../components/common/Card";
import { getRooms, deleteRoom } from "../../services/admin/room.service";

export default function AdminRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Confirm", "Delete this room?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteRoom(id);
            fetchRooms();
          } catch {
            Alert.alert("Error", "Failed to delete room");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Rooms</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : rooms.length === 0 ? (
        <Text>No rooms available.</Text>
      ) : (
        rooms.map((room) => (
          <Card
            key={room.id}
            title={room.name}
            subtitle={`Price: KES ${room.price_kes_per_month}`}
            onPress={() => router.push(`/admin/rooms/${room.id}`)}
          >
            <TouchableOpacity onPress={() => handleDelete(room.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </Card>
        ))
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/admin/rooms/new")}
      >
        <Text style={styles.addText}>+ Add Room</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f7f8fa", flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  delete: { color: "red", marginTop: 8 },
});
