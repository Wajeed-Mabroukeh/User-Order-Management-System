import { UserProfile } from "../types/user";
import { httpRequest } from "./http";

export const userApi = {
  getMyProfile(token: string) {
    return httpRequest<UserProfile>("/users/me", { token });
  }
};
