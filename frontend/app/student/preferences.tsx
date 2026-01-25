import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
  },
  section: {
    backgroundColor: "#fff",
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
    borderColor: "#6c63ff",
    marginRight: 8,
    marginBottom: 8,
  },
  facilitySelected: {
    backgroundColor: "#6c63ff",
  },
  facilityText: {
    color: "#6c63ff",
    fontSize: 13,
  },
  facilityTextSelected: {
    color: "#fff",
  },
  buttonSpacing: {
    marginTop: 20,
  },
});
