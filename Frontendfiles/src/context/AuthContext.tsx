import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { UserRole } from "../api/client";

interface User {
  role: UserRole;
  name: string;
  identifier?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, name: string, identifier?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((role: UserRole, name: string, identifier?: string) => {
    setUser({ role, name, identifier });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
