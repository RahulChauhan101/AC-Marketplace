import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api, { setAuthToken } from "../services/api";

const TOKEN_KEY = "servicewale_serviceman_token";
const USER_KEY = "servicewale_serviceman_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken) {
          setAuthToken(storedToken);
          setToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const persistSession = async (authToken, authUser) => {
    setAuthToken(authToken);
    setToken(authToken);
    setUser(authUser);

    await AsyncStorage.setItem(TOKEN_KEY, authToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(authUser));
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const authUser = data.data.user;

    if (authUser.role !== "serviceman") {
      throw new Error("Only serviceman accounts can use this app.");
    }

    await persistSession(data.token, authUser);
    return authUser;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", {
      ...payload,
      role: "serviceman",
    });
    const authUser = data.data.user;

    if (authUser.role !== "serviceman") {
      throw new Error("Only serviceman accounts can use this app.");
    }

    await persistSession(data.token, authUser);
    return authUser;
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.data.user);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
    return data.data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/me", payload);
    setUser(data.data.user);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
    return data.data.user;
  };

  const logout = async () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      loading,
      login,
      logout,
      refreshProfile,
      register,
      token,
      updateProfile,
      user,
    }),
    [loading, token, user]
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
