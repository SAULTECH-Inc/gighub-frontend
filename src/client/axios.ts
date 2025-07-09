import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, storage } from "../utils/constants.ts";

const baseURL = API_BASE_URL || "http://localhost:3005";

export const publicApiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateApiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

privateApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

privateApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        const newAccessToken = refreshResponse.data?.token;
        if (newAccessToken) {
          storage.setItem("authToken", newAccessToken);
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return privateApiClient.request(error.config);
        }
      } catch (refreshError) {
        storage.removeItem("authToken");
        window.location.href = "/login";
        throw refreshError;
      }
    }
    return Promise.reject(error);
  },
);
