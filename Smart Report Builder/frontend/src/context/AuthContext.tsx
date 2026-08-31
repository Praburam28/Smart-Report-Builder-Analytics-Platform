import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../api/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  authChecking: boolean;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(() =>
      localStorage.getItem("access_token"),
    );

  const [loading, setLoading] =
    useState(false);

  const [authChecking, setAuthChecking] =
    useState(true);

  // Restore existing login session
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken =
        localStorage.getItem(
          "access_token",
        );

      if (!storedToken) {
        setAuthChecking(false);
        return;
      }

      try {
        const response =
          await api.get<User>(
            "/api/auth/me",
          );

        setToken(storedToken);
        setUser(response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data),
        );
      } catch (error) {
        console.error(
          "Session validation failed:",
          error,
        );

        localStorage.removeItem(
          "access_token",
        );

        localStorage.removeItem(
          "user",
        );

        setToken(null);
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (
    email: string,
    password: string,
  ) => {
    setLoading(true);

    try {
      // 1. Login
      const loginResponse =
        await api.post(
          "/api/auth/login",
          {
            email,
            password,
          },
        );

      const accessToken =
        loginResponse.data.access_token;

      if (!accessToken) {
        throw new Error(
          "Login succeeded but no access token was returned.",
        );
      }

      // 2. Store token BEFORE calling /me
      localStorage.setItem(
        "access_token",
        accessToken,
      );

      setToken(accessToken);

      // 3. Get logged-in user
      const meResponse =
        await api.get<User>(
          "/api/auth/me",
        );

      // 4. Store user
      setUser(meResponse.data);

      localStorage.setItem(
        "user",
        JSON.stringify(
          meResponse.data,
        ),
      );

      setAuthChecking(false);
    } catch (error) {
      console.error(
        "Login failed:",
        error,
      );

      localStorage.removeItem(
        "access_token",
      );

      localStorage.removeItem(
        "user",
      );

      setToken(null);
      setUser(null);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(
      "access_token",
    );

    localStorage.removeItem(
      "user",
    );

    setToken(null);
    setUser(null);
    setAuthChecking(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        authChecking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}