import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "servicewale_admin_token";
const USER_KEY = "servicewale_admin_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
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
        if (data.data.user.role !== "admin") {
          throw new Error("Only admin users can access this panel.");
        }

        setUser(data.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const adminUser = data.data.user;

    if (adminUser.role !== "admin") {
      throw new Error("Only admin users can access this panel.");
    }

    setToken(data.token);
    setUser(adminUser);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
    return adminUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      logout,
      token,
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
