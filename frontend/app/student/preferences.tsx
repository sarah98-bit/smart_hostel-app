import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function PreferencesScreen() {
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [roomType, setRoomType] = useState("");

  const handleSave = () => {
    if (!location || !budget || !roomType) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Alert.alert("✅ Preferences Saved", `Location: ${location}\nBudget: ${budget}\nRoom Type: ${roomType}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Preferences</Text>

      <Input placeholder="Preferred Location" value={location} onChangeText={setLocation} />
      <Input placeholder="Budget (Ksh)" value={budget} onChangeText={setBudget} keyboardType="numeric" />
      <Input placeholder="Room Type (Single/Double...)" value={roomType} onChangeText={setRoomType} />

      <Button title="Save Preferences" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f8fa" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 15 },
});
