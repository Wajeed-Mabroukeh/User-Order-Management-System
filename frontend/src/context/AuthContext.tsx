import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import { AuthResponse, AuthenticatedUser, LoginRequest, RegisterRequest } from "../types/auth";

interface AuthContextValue {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const setSessionFromAuthResponse = (response: AuthResponse) => {
    setUser({
      id: response.userId,
      name: response.name,
      email: response.email,
      role: "USER"
    });
  };

  const login = async (payload: LoginRequest) => {
    setIsAuthLoading(true);
    try {
      const response = await authApi.login(payload);
      setSessionFromAuthResponse(response);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (payload: RegisterRequest) => {
    setIsAuthLoading(true);
    try {
      const response = await authApi.register(payload);
      setSessionFromAuthResponse(response);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      setIsAuthLoading(true);
      try {
        const profile = await userApi.getMyProfile();
        if (!isMounted) {
          return;
        }
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: "USER"
        });
      } catch {
        if (!isMounted) {
          return;
        }
        setUser(null);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      login,
      register,
      logout
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
