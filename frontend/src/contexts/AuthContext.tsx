"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  avatar_url?: string;
  active_projects_count?: number;
  // Add other claims if needed
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = React.useCallback(async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else if (res.status === 401 || res.status === 403) {
        // Only log out if specifically unauthorized
        localStorage.removeItem("token");
        setUser(null);
      } else {
        // For other errors, try to at least decode the token
        const decoded = jwtDecode<any>(token);
        setUser({
            ...decoded,
            email: decoded.email || decoded.sub,
            full_name: decoded.full_name || decoded.name
        });
        console.warn("Using decoded token instead of fresh profile due to status:", res.status);
      }
    } catch (err) {
      console.error("Failed to fetch user, falling back to decoding token", err);
      try {
        const decoded = jwtDecode<any>(token);
        setUser({
            ...decoded,
            email: decoded.email || decoded.sub,
            full_name: decoded.full_name || decoded.name
        });
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<any>(token);
    setUser({
        ...decoded,
        email: decoded.email || decoded.sub,
        full_name: decoded.full_name || decoded.name,
        avatar_url: decoded.avatar_url
    });
    
    // Direct redirection based on role
    const role = (decoded as any).role?.toLowerCase();
    switch (role) {
      case "admin":
        router.push("/dashboard/pricing");
        break;
      case "manager":
        router.push("/dashboard/manager");
        break;
      case "valuer":
        router.push("/dashboard/valuer");
        break;
      case "inspector":
        router.push("/dashboard/inspector");
        break;
      default:
        router.push("/dashboard"); // Fallback
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
