import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

// Public API Client (No Authentication)
export const publicApiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Private API Client (Requires Authentication)
export const privateApiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

privateApiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);