import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@students.dkut.ac.ke");
  const [phone, setPhone] = useState("0712345678");

  const handleSave = () => {
    Alert.alert("✅ Profile Updated", `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Input placeholder="Full Name" value={name} onChangeText={setName} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Button title="Update Profile" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f8fa" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 15 },
});
