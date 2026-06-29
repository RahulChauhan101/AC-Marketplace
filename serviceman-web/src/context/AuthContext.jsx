import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api, { setAuthToken } from "../services/api";

const TOKEN_KEY = "servicewale_serviceman_token";
const USER_KEY = "servicewale_serviceman_user";

const AuthContext = createContext(null);

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

      setAuthToken(token);

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const persistSession = (authToken, authUser) => {
    setAuthToken(authToken);
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const authUser = data.data.user;

    if (authUser.role !== "serviceman") {
      throw new Error("Only serviceman accounts can use this app.");
    }

    persistSession(data.token, authUser);
    return authUser;
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
    return data.data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/me", payload);
    setUser(data.data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
    return data.data.user;
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      loading,
      login,
      logout,
      refreshProfile,
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
