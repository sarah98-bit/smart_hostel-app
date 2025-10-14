import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  username: string;
  email: string;
  role: "student" | "admin";
}

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user info
    AsyncStorage.getItem("user").then((savedUser) => {
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
    });
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, setUser, loading } },
    children
  );
}

export const useAuth = () => useContext(AuthContext);
