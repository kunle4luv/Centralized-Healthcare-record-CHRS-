import { createContext, useState, useCallback, type ReactNode } from "react";
import type { UserRole } from "../api/client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface User {
  role: UserRole;
  name: string;
  identifier?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (role: UserRole, name: string, identifier?: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper to get stored auth data
const getStoredAuth = () => {
  const token = localStorage.getItem("chrs_token");
  const user = localStorage.getItem("chrs_user");
  let parsedUser = null;
  if (user) {
    try {
      parsedUser = JSON.parse(user);
    } catch (e) {
      console.warn("Failed to parse stored user data:", e);
    }
  }
  return { token, user: parsedUser };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedAuth = getStoredAuth();
    return storedAuth.user;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedAuth = getStoredAuth();
    return storedAuth.token;
  });
  const [loading, setLoading] = useState(false);

  // Login function that calls the backend API
  const login = useCallback(async (role: UserRole, name: string, identifier?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Use demo-login endpoint for easy testing
      const response = await fetch(`${API_BASE}/api/auth/demo-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          name,
          identifier: identifier || name
        }),
      });

      if (!response.ok) {
        // Fallback to local login if API is not available
        console.warn("API login failed, using local fallback");
        const localUser = { role, name, identifier };
        setUser(localUser);
        localStorage.setItem("chrs_user", JSON.stringify(localUser));
        setLoading(false);
        return true;
      }

      const data = await response.json();
      
      // Store token and user data
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("chrs_token", data.token);
      }

      if (data.user) {
        const userData = {
          role: data.user.role,
          name: data.user.name,
          identifier: data.user.identifier,
          email: data.user.email
        };
        setUser(userData);
        localStorage.setItem("chrs_user", JSON.stringify(userData));
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      // Fallback to local login
      const localUser = { role, name, identifier };
      setUser(localUser);
      localStorage.setItem("chrs_user", JSON.stringify(localUser));
      setLoading(false);
      return true;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("chrs_token");
    localStorage.removeItem("chrs_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

