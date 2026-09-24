import { apiClient } from "@/lib/api/client";

export type LoginCredentials = { username: string; password: string };

export type AuthenticatedUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export async function login(credentials: LoginCredentials) {
  const { data } = await apiClient.post<AuthenticatedUser>("/auth/login", {
    ...credentials,
    expiresInMins: 60,
  })
  return data;
}
