import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "ADMIN") {
    return <Redirect href="/auth/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
