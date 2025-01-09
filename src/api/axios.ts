import {toast} from "react-toastify";

const baseURL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

type ApiResponse<T> = T;

const fetchWithAuth = async <T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const config: FetchOptions = {
        ...options,
        headers,
        credentials: 'include',  // Necessary for cookies/auth headers
    };


    try {
        const response = await fetch(`${baseURL}${url}`, config);
        if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.message || 'Something went wrong');
            throw new Error(errorData.message || 'Something went wrong');
        }
        return (await response.json()) as ApiResponse<T>;
    } catch (error: any) {
        console.error('Error during fetch:', error);
        toast.error(error.message || 'Something went wrong');
        throw error; // Rethrow the error so the caller handles it
    }
};

const fetchPublic = async <T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config: FetchOptions = {
        ...options,
        headers,
        // credentials: 'include',  // Necessary for cookies/auth headers
    };


    try {
        const response = await fetch(`${baseURL}${url}`, config);
        if (!response.ok) {
            const errorData = await response.json();
            console.log("RESPONSE DATA: " + errorData);
            toast.error(errorData.message || 'Something went wrong', {
                position: 'top-center',
            });
            throw new Error(errorData.message || 'Something went wrong');
        }
        return (await response.json()) as ApiResponse<T>;
    } catch (error: any) {
        console.error('Error during fetch:', error);
        toast.error(error.message || 'Something went wrong', {
            position: 'top-left',
        });
        throw error; // Rethrow the error so the caller handles it
    }
};



export const privateApiClient = {
    get: <T>(url: string) => fetchWithAuth<T>(url, { method: 'GET' }),
    post: <T>(url: string, body: unknown) =>
        fetchWithAuth<T>(url, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(url: string, body: unknown) =>
        fetchWithAuth<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(url: string) => fetchWithAuth<T>(url, { method: 'DELETE' }),
};

export const publicApiClient = {
    get: <T>(url: string) => fetchPublic<T>(url, { method: 'GET' }),
    post: <T>(url: string, body: unknown) =>
        fetchPublic<T>(url, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(url: string, body: unknown) =>
        fetchPublic<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(url: string) => fetchPublic<T>(url, { method: 'DELETE' }),
};
