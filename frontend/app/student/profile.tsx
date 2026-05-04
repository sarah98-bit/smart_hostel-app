import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/common/Button";
import { getProfile, createProfile, updateProfile } from "../../services/profile.service";

type ProfileMode = "loading" | "create" | "view" | "edit";
type Gender = "male" | "female" | "other";

export default function ProfileScreen() {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [mode, setMode] = useState<ProfileMode>("loading");
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem("user");
        if (!raw) throw new Error("Not logged in");
        const user = JSON.parse(raw);
        setUserId(user.id);
      } catch {
        Alert.alert("Session expired", "Please log in again.");
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(userId);
        setPhone(profile.phone ?? "");
        setFullName(profile.fullName ?? "");
        setRegNo(profile.registrationNumber ?? "");
        setGender((profile.gender as Gender) ?? "");
        setMode("view");
      } catch {
        setMode("create");
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;

    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full name is required.");
      return;
    }
    if (!regNo.trim()) {
      Alert.alert("Validation Error", "Registration number is required.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone number is required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        registrationNumber: regNo.trim(),
        phone: phone.trim(),
        ...(gender ? { gender } : {}),
      };

      if (mode === "create") {
        await createProfile(userId, payload);
        Alert.alert("Success", "Profile created successfully!");
      } else {
        await updateProfile(userId, payload);
        Alert.alert("Success", "Profile updated successfully!");
      }

      setMode("view");
    } catch (error: any) {
  // Handle both plain string rejections (from api.ts interceptor)
  // and proper Error objects
  const message =
    typeof error === "string"
      ? error
      : error?.response?.data?.message ||
        error?.message ||
        (mode === "create"
          ? "Failed to create profile. Please try again."
          : "Failed to update profile. Please try again.");

      Alert.alert("Error", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!userId) return;
    try {
      const profile = await getProfile(userId);
      setPhone(profile.phone ?? "");
      setFullName(profile.fullName ?? "");
      setRegNo(profile.registrationNumber ?? "");
      setGender((profile.gender as Gender) ?? "");
    } catch {
      setPhone("");
      setFullName("");
      setRegNo("");
      setGender("");
    } finally {
      setMode("view");
    }
  };

  const isEditable = mode === "create" || mode === "edit";

  if (mode === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === "create" ? "Create Profile" : "Student Profile"}
        </Text>
        {mode === "view" && (
          <TouchableOpacity onPress={() => setMode("edit")} style={styles.editBadge}>
            <Text style={styles.editBadgeText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {mode === "create" && (
        <Text style={styles.subtitle}>
          Welcome! Please fill in your details to get started.
        </Text>
      )}

      {/* Full Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, isEditable && styles.inputEditable]}
          value={fullName}
          onChangeText={setFullName}
          editable={isEditable}
          placeholder="Enter your full name"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
        />
      </View>

      {/* Registration Number */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Registration Number</Text>
        <TextInput
          style={[styles.input, isEditable && styles.inputEditable]}
          value={regNo}
          onChangeText={setRegNo}
          editable={isEditable}
          placeholder="e.g. STU/2024/001"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
        />
      </View>

      {/* Phone */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, isEditable && styles.inputEditable]}
          value={phone}
          onChangeText={setPhone}
          editable={isEditable}
          placeholder="Enter your phone number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />
      </View>

      {/* Gender */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Gender</Text>
        {isEditable ? (
          <View style={styles.genderRow}>
            {(["male", "female", "other"] as Gender[]).map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderOption, gender === g && styles.genderSelected]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.genderText, gender === g && styles.genderTextSelected]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "—"}
            editable={false}
          />
        )}
      </View>

      {/* Actions */}
      {isEditable && (
        <View style={styles.actions}>
          <Button
            title={isSaving ? "Saving..." : mode === "create" ? "Create Profile" : "Save Changes"}
            onPress={handleSave}
          />
          {mode === "edit" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: "#6B7280", fontSize: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  editBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editBadgeText: { color: "#4F46E5", fontWeight: "600", fontSize: 13 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "500", color: "#374151", marginBottom: 6 },
  input: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: "#6B7280",
  },
  inputEditable: {
    backgroundColor: "#fff",
    borderColor: "#4F46E5",
    color: "#111827",
  },
  genderRow: { flexDirection: "row", gap: 10 },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  genderSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4F46E5",
  },
  genderText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  genderTextSelected: { color: "#4F46E5", fontWeight: "600" },
  actions: { marginTop: 8, gap: 12 },
  cancelButton: { alignItems: "center", paddingVertical: 12 },
  cancelText: { color: "#6B7280", fontSize: 15, fontWeight: "500" },
});