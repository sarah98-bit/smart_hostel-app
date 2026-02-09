import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HostelRecommendation } from "@/services/recommendation.service";

export default function RecommendationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [recommendations, setRecommendations] = useState<HostelRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (params.data) {
        const parsedData = JSON.parse(params.data as string);
        setRecommendations(parsedData);
      }
    } catch (error) {
      console.error("Error parsing recommendations data:", error);
      Alert.alert("Error", "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, [params.data]);

  const handleBookNow = (hostel: HostelRecommendation) => {
    // Navigate directly to booking screen
    router.push({
      pathname: "/student/booking",
      params: {
        hostelId: hostel.hostel_id,
        name: hostel.name,
        price: hostel.price_kes_per_month.toString(),
      },
    });
  };

  const renderHostelCard = ({ item, index }: { item: HostelRecommendation; index: number }) => (
    <View style={styles.card}>
      {/* Rank Badge */}
      <View style={[styles.rankBadge, index === 0 && styles.topRank]}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>

      {/* Score Badge */}
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreText}>
          {item.score ? item.score.toFixed(1) : "N/A"}
        </Text>
        <Text style={styles.scoreLabel}>Match</Text>
      </View>

      {/* Hostel Info */}
      <View style={styles.cardContent}>
        <Text style={styles.hostelName}>{item.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>💰 Price:</Text>
          <Text style={styles.infoValue}>
            KES {item.price_kes_per_month.toLocaleString()}/month
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📍 Distance:</Text>
          <Text style={styles.infoValue}>{item.distance_km} km</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>🛏️ Room Types:</Text>
          <Text style={styles.infoValue}>{item.room_types}</Text>
        </View>

        {item.rating && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⭐ Rating:</Text>
            <Text style={styles.infoValue}>
              {item.rating.toFixed(1)}/5.0
            </Text>
          </View>
        )}

        <View style={styles.facilitiesContainer}>
          <Text style={styles.infoLabel}>🏷️ Facilities:</Text>
          <Text style={styles.facilities} numberOfLines={3}>
            {item.facilities}
          </Text>
        </View>

        {index < 3 && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>
              {index === 0 ? "🏆 Top Match" : "✨ Highly Recommended"}
            </Text>
          </View>
        )}

        {/* Book Now Button */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleBookNow(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.bookButtonText}>Book This Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ImageBackground
        source={require("../../assets/images/dashboard-bg.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8888cf" />
          <Text style={styles.loadingText}>Loading recommendations...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <ImageBackground
        source={require("../../assets/images/dashboard-bg.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recommendations found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your preferences
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/dashboard-bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Your Top {recommendations.length} Matches
          </Text>
          <Text style={styles.subtitle}>
            Tap "Book This Room" to reserve your preferred hostel
          </Text>
        </View>

        {/* Scrollable List */}
        <FlatList
          data={recommendations}
          renderItem={renderHostelCard}
          keyExtractor={(item) => item.hostel_id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          windowSize={10}
        />

        {/* Fixed Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.newSearchButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.newSearchText}>New Search</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
    zIndex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#dfa4a4f3",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#e2d391d3",
  },
  listContainer: {
    padding: 15,
    paddingTop: 5,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  rankBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#8888cf",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 5,
  },
  topRank: {
    backgroundColor: "#FFD700",
  },
  rankText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  scoreBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    zIndex: 2,
    minWidth: 60,
    elevation: 5,
  },
  scoreText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  scoreLabel: {
    color: "#fff",
    fontSize: 10,
  },
  cardContent: {
    padding: 15,
    paddingTop: 60,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  facilitiesContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  facilities: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    lineHeight: 18,
  },
  recommendedBadge: {
    marginTop: 12,
    backgroundColor: "#e3f2fd",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  recommendedText: {
    color: "#1976d2",
    fontSize: 13,
    fontWeight: "600",
  },
  bookButton: {
    backgroundColor: "#8888cf",
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  newSearchButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8888cf",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newSearchText: {
    color: "#8888cf",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#e2d391d3",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#dfa4a4f3",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#e2d391d3",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#8888cf",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});