import { createContext, ReactNode, useMemo, useState } from "react";
import { authApi } from "../services/authApi";
import { AuthResponse, AuthenticatedUser, LoginRequest, RegisterRequest } from "../types/auth";

interface AuthContextValue {
  token: string | null;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const setSessionFromAuthResponse = (response: AuthResponse) => {
    setToken(response.accessToken);
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

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAuthLoading,
      login,
      register,
      logout
    }),
    [token, user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
