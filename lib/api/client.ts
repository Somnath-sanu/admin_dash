import axios, { AxiosError } from "axios";

import { getAccessToken } from "@/lib/auth/token";

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      (error.response?.status === 401
        ? "Your session is no longer valid. Please log in again."
        : "Something went wrong. Please try again.");
    return Promise.reject(new ApiError(message, error.response?.status));
  },
);
