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
import { useRouter } from "expo-router";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { getRecommendations } from "@/services/recommendation.service";

const FACILITIES = ["WiFi", "Water", "Security", "Parking", "Laundry"];

export default function PreferencesScreen() {
  const router = useRouter();

  const [maxPrice, setMaxPrice] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [roomType, setRoomType] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sleepTime, setSleepTime] = useState("");
  const [studyHabit, setStudyHabit] = useState("");
  const [visitorTolerance, setVisitorTolerance] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSubmit = async () => {
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
        sleepTime,
        studyHabit,
        visitorTolerance,
      };

      const results = await getRecommendations(preferences, {
        maxPrice: 0,
        maxDistance: 0,
        roomType: "",
        facilities: []
      });

      router.push({
        pathname: "/student/recommendations",
        params: {
          data: JSON.stringify(results),
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/dashboard-bg.jpeg")} // JPEG background
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay */}
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Hostel Preferences</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Maximum Budget (KES)</Text>
          <Input
            placeholder="e.g. 8000"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Maximum Distance (KM)</Text>
          <Input
            placeholder="e.g. 2"
            keyboardType="numeric"
            value={maxDistance}
            onChangeText={setMaxDistance}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Preferred Room Type</Text>
          <Input
            placeholder="Single / Double / Bedsitter"
            value={roomType}
            onChangeText={setRoomType}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Facilities</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent dark overlay
  },
  container: {
    flexGrow: 1,
    padding: 20,
    position: "relative", // ensures content is above overlay
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#dfa4a4f3", // change text to white for readability
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
