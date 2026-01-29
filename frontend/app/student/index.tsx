import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function StudentIndex() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "STUDENT") {
        Alert.alert("Access Denied", "You must be a student to access this page.");
        router.replace("/auth/login");
      } else {
        router.replace("/student/dashboard");
      }
    }
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6c63ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
});
