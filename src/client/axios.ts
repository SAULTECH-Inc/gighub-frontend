import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, NODE_ENV, storage } from "../utils/constants.ts";
import { removeFromLocalStorage } from "../store/useAuth.ts";

const baseURL = API_BASE_URL || "http://localhost:3005";

// ============================================
// PUBLIC API CLIENT (for login, signup, 2FA)
// ============================================
export const publicApiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor for public API
publicApiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const deviceIp = localStorage.getItem("current_ip");
        if (deviceIp) {
            // Use lowercase for consistency
            config.headers["x-device-ip"] = deviceIp;
        }

        const userAgent = localStorage.getItem("current_ua");
        if (userAgent) {
            config.headers["x-user-agent"] = userAgent;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for public API
publicApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log detailed error information for debugging
        if (error.response) {
            console.error("API Error Response:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else if (error.request) {
            console.error("API Error Request (no response):", {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers,
            });
        } else {
            console.error("API Error:", error.message);
        }
        return Promise.reject(error);
    }
);

// ============================================
// PRIVATE API CLIENT (for authenticated requests)
// ============================================
export const privateApiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor for private API
privateApiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add auth token
        const token = storage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add device IP (use lowercase for consistency)
        const deviceIp = localStorage.getItem("current_ip");
        if (deviceIp) {
            config.headers["x-device-ip"] = deviceIp;
        }

        // Add user agent
        const userAgent = localStorage.getItem("current_ua");
        if (userAgent) {
            config.headers["x-user-agent"] = userAgent;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for private API (with token refresh)
privateApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized with token refresh
        if (error.response && error.response.status === 401) {
            try {
                const refreshResponse = await publicApiClient.post(
                    `${baseURL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data?.token;
                if (newAccessToken) {
                    storage.setItem("authToken", newAccessToken);
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return privateApiClient.request(error.config);
                }
            } catch (refreshError) {
                // Token refresh failed - logout user
                storage.removeItem("authToken");
                await removeFromLocalStorage(NODE_ENV).then(() => {
                    window.location.href = "/login";
                });
                throw refreshError;
            }
        }

        // Log other errors
        if (error.response) {
            console.error("API Error Response:", {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
            });
        } else if (error.request) {
            console.error("API Error Request (no response):", {
                url: error.config?.url,
                method: error.config?.method,
            });
        }

        return Promise.reject(error);
    }
);