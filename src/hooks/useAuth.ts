import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { login, logout, selectAuth } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";

type AuthHook = {
    isAuthenticated: boolean;
    user: any | null;  // Adjust to your user type
    login: (email: string, password: string) => void;
    logout: () => void;
};

export const useAuth = (): AuthHook => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector(selectAuth);

    const loginUser = useCallback(
        (email: string, password: string) => {
            dispatch(login({ email, password }));
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
