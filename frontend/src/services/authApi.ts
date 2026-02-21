import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import { httpRequest } from "./http";

export const authApi = {
  login(payload: LoginRequest) {
    return httpRequest<AuthResponse, LoginRequest>("/auth/login", {
      method: "POST",
      body: payload
    });
  },
  register(payload: RegisterRequest) {
    return httpRequest<AuthResponse, RegisterRequest>("/auth/register", {
      method: "POST",
      body: payload
    });
  }
};
