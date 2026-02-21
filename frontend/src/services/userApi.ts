import { UserProfile } from "../types/user";
import { httpRequest } from "./http";

export const userApi = {
  getMyProfile() {
    return httpRequest<UserProfile>("/users/me");
  }
};
