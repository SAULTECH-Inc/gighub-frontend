export type User = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    token: string;
};

export type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    success: boolean;
};

export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    success: false,
};

export interface APIResponse<D> {
    data: D;
    message?: string;
    path?: string;
    error?: string
    statusCode?: number;
}