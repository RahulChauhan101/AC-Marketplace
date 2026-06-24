import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [[, storedToken], [, storedUser]] = await AsyncStorage.multiGet([
          "ac_customer_token",
          "ac_customer_user",
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          const { data } = await api.get("/auth/me");
          setUser(data.data.user);
          await AsyncStorage.setItem("ac_customer_user", JSON.stringify(data.data.user));
        }
      } catch {
        await AsyncStorage.multiRemove(["ac_customer_token", "ac_customer_user"]);
        setToken(null);
        setUser(null);
      } finally {
        setBooting(false);
      }
    };

    restoreSession();
  }, []);

  const persistSession = async (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    await AsyncStorage.multiSet([
      ["ac_customer_token", authToken],
      ["ac_customer_user", JSON.stringify(authUser)],
    ]);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    await persistSession(data.token, data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", {
      ...payload,
      role: "customer",
    });
    await persistSession(data.token, data.data.user);
    return data.data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/me", payload);
    setUser(data.data.user);
    await AsyncStorage.setItem("ac_customer_user", JSON.stringify(data.data.user));
    return data.data.user;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(["ac_customer_token", "ac_customer_user"]);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      booting,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      updateProfile,
      logout,
    }),
    [token, user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
