import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

export const publicApiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

privateApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                const refreshResponse = await publicApiClient.post('/refresh-token', {}, { withCredentials: true });
                const newAccessToken = refreshResponse.data.data.token;
                localStorage.setItem('token', newAccessToken);
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return privateApiClient.request(error.config);
            } catch (error: any) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw error;
            }
        }
        return Promise.reject(error);
    }
);
