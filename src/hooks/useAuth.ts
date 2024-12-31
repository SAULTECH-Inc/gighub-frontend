// useAuth.ts
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { login, logout, selectAuth } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";
import {publicApiClient} from "../api/axios.ts";
import {APIResponse, User} from "../services/types";

type AuthHook = {
    isAuthenticated: boolean;
    user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        token: string;
    } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

export const useAuth = (): AuthHook => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector(selectAuth);

    const loginUser = useCallback(
        async (email: string, password: string) => {
            try {
                const response = await publicApiClient.post<APIResponse<User>>("/api/auth/login", {
                    email,
                    password,
                });

                const data = response.data;

                // Only dispatch the relevant fields, excluding sensitive data
                dispatch(
                    login({
                        id: data.id,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        token: data.token,
                    })
                );
            } catch (error) {
                console.error("Login failed:", error);
            }
        },
        [dispatch]
    );

    const logoutUser = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return {
        isAuthenticated,
        user,
        login: loginUser,
        logout: logoutUser,
    };
};
