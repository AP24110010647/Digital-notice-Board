import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const stored = localStorage.getItem("user");

  try {
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  const persistSession = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        const { data } = await api.get("/auth/me");
        persistSession(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "admin",
      login: async (payload) => {
        const { data } = await api.post("/auth/login", payload);
        persistSession(data);
      },
      register: async (payload) => {
        const { data } = await api.post("/auth/register", payload);
        persistSession(data);
      },
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
