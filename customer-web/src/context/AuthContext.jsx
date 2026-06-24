import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ac_customer_token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("ac_customer_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
        localStorage.setItem("ac_customer_user", JSON.stringify(data.data.user));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem("ac_customer_token");
        localStorage.removeItem("ac_customer_user");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const persistSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem("ac_customer_token", authToken);
    localStorage.setItem("ac_customer_user", JSON.stringify(authUser));
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data.token, data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", {
      ...payload,
      role: "customer",
    });
    persistSession(data.token, data.data.user);
    return data.data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/me", payload);
    setUser(data.data.user);
    localStorage.setItem("ac_customer_user", JSON.stringify(data.data.user));
    return data.data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("ac_customer_token");
    localStorage.removeItem("ac_customer_user");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      updateProfile,
      logout,
    }),
    [token, user, loading]
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
