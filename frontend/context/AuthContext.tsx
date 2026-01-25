import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/services/types";

interface AuthContextType {
  user: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  const loginUser = async (user: User) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUser(user); // 🔑 THIS triggers rerender
  };

  const logoutUser = async () => {
    await AsyncStorage.multiRemove(["user", "token"]);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
