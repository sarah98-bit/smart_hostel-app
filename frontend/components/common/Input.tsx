import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  placeholder: string;
  icon?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"; // 👈 Added
}

export default function Input({
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default", // 👈 Added default value
}: Props) {
  return (
    <View style={styles.container}>
      {icon && <Ionicons name={icon as any} size={20} color="#555" style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#888"
        keyboardType={keyboardType} // 👈 Added
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#302f2fff",
  },
});
