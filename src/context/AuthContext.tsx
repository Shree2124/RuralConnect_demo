import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, UserRole } from "../types";
import { DEMO_CREDENTIALS, ROLE_DASHBOARD_ROUTES, validateCredentials } from "../lib/demo-credentials";
import { MOCK_USERS } from "../lib/mock-data";

interface AuthSession {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
}

interface AuthContextType {
  session: AuthSession | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; error?: string }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "rc_demo_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const currentUser = session
    ? MOCK_USERS.find((u) => u.id === session.userId) || null
    : null;

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; redirectTo?: string; error?: string }> => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const cred = validateCredentials(email.trim(), password);
      if (!cred) {
        return { success: false, error: "Invalid email or password. Try demo credentials." };
      }

      const user = MOCK_USERS.find((u) => u.email === cred.email);
      if (!user) return { success: false, error: "User not found." };

      const newSession: AuthSession = {
        userId: user.id,
        role: cred.role,
        name: cred.name,
        email: cred.email,
      };

      setSession(newSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));

      return {
        success: true,
        redirectTo: ROLE_DASHBOARD_ROUTES[cred.role],
      };
    },
    []
  );

  const loginAsRole = useCallback((role: UserRole) => {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === role);
    if (!cred) return;
    const user = MOCK_USERS.find((u) => u.email === cred.email);
    if (!user) return;

    const newSession: AuthSession = {
      userId: user.id,
      role: cred.role,
      name: cred.name,
      email: cred.email,
    };
    setSession(newSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, currentUser, isAuthenticated: !!session, login, loginAsRole, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
