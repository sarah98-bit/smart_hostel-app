import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/services/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    };
    init();
  }, []);

  return {
    user,
    role: user?.role,
    authenticated: !!user,
    loading,
  };
}
