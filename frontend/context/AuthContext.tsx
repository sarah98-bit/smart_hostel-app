import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/services/types";

interface AuthContextType {
  user: User | null;
  loginUser: (user: User) => Promise<void>;
  logoutUser: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Derived auth state
  const isAuthenticated = !!user;

  // Load user from AsyncStorage on mount
  useEffect(() => {
    const init = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Save user on login
  const loginUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  };

  // Clear storage on logout
  const logoutUser = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, logoutUser, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
