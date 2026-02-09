import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import Button from "@/components/common/Button";
import { getRecommendations } from "@/services/recommendation.service";

const FACILITIES = ["WiFi", "Water", "Security", "Parking", "Laundry"];

/* === Derived from Dataset === */
const BUDGET_OPTIONS = [
  { label: "Low (below 10,500 KES)", value: 10500 },
  { label: "Mid (10,501 - 14,500 KES)", value: 14500 },
  { label: "High (14,501 - 20,000 KES)", value: 20000 },
];

const DISTANCE_OPTIONS = [
  { label: "0 - 1 km", value: 1 },
  { label: "1.1 - 2 km", value: 2 },
  { label: "2.1 - 3 km", value: 3 },
  { label: "3.1 - 5 km", value: 5 },
];

const ROOM_TYPES = [
  "Single",
  "Double",
  "Triple",
  "Ensuite",
  "Self-contained",
];

export default function PreferencesScreen() {
  const router = useRouter();

  const [maxPrice, setMaxPrice] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [roomType, setRoomType] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!maxPrice || !maxDistance || !roomType) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const preferences = {
        maxPrice: Number(maxPrice),
        maxDistance: Number(maxDistance),
        roomType,
        facilities: selectedFacilities,
      };

      console.log("Submitting preferences:", preferences);

      // Call the recommendation service
      const results = await getRecommendations(preferences);

      console.log(`Received ${results.length} recommendations`);

      if (!results || results.length === 0) {
        Alert.alert(
          "No Results",
          "No hostels match your preferences. Try adjusting your criteria.",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      // Navigate to recommendations screen with results
      router.push({
        pathname: "/student/recommendations",
        params: {
          data: JSON.stringify(results),
        },
      });
    } catch (error: any) {
      console.error("Error getting recommendations:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to get recommendations. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/dashboard-bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Hostel Preferences</Text>

        {/* === Budget Dropdown === */}
        <View style={styles.section}>
          <Text style={styles.label}>Maximum Budget *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={maxPrice}
              onValueChange={(value) => setMaxPrice(String(value))}
            >
              <Picker.Item label="Select budget" value="" />
              {BUDGET_OPTIONS.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* === Distance Dropdown === */}
        <View style={styles.section}>
          <Text style={styles.label}>Maximum Distance *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={maxDistance}
              onValueChange={(value) => setMaxDistance(String(value))}
            >
              <Picker.Item label="Select distance" value="" />
              {DISTANCE_OPTIONS.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* === Room Type Dropdown === */}
        <View style={styles.section}>
          <Text style={styles.label}>Preferred Room Type *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={roomType}
              onValueChange={(value) => setRoomType(value)}
            >
              <Picker.Item label="Select room type" value="" />
              {ROOM_TYPES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        {/* === Facilities === */}
        <View style={styles.section}>
          <Text style={styles.label}>Facilities (Optional)</Text>
          <View style={styles.facilityContainer}>
            {FACILITIES.map((facility) => {
              const selected = selectedFacilities.includes(facility);
              return (
                <TouchableOpacity
                  key={facility}
                  style={[
                    styles.facilityChip,
                    selected && styles.facilitySelected,
                  ]}
                  onPress={() => toggleFacility(facility)}
                >
                  <Text
                    style={[
                      styles.facilityText,
                      selected && styles.facilityTextSelected,
                    ]}
                  >
                    {facility}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.buttonSpacing}>
          <Button
            title={loading ? "Finding Hostels..." : "Get Recommendations"}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#dfa4a4f3",
  },
  section: {
    backgroundColor: "#e2d391d3",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#0c161dde",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  facilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  facilityChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0c161dde",
    marginRight: 8,
    marginBottom: 8,
  },
  facilitySelected: {
    backgroundColor: "#8888cf",
  },
  facilityText: {
    color: "#0a0a0a",
    fontSize: 13,
  },
  facilityTextSelected: {
    color: "#ffffff",
  },
  buttonSpacing: {
    marginTop: 20,
  },
});