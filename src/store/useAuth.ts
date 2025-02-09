import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApplicantSignupRequest, EmployerSignupRequest } from "../utils/types";
import {toast} from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

export type UserRole = "employer" | "applicant";

export interface LoginRequest {
    email: string;
    password: string;
}

export type SignupRequest = EmployerSignupRequest | ApplicantSignupRequest;

export interface AuthData {
    isAuthenticated: boolean;
    user: any | null;
    role: UserRole | null;
    loading: boolean;
    error: string | null;
    login: (data: LoginRequest, role: UserRole) => void;
    signup: (data: SignupRequest, role: UserRole) => void;
    logout: () => void;
}

// Zustand Store
export const useAuth = create<AuthData>()(
    persist(
        (set) => {
            // Get initial token and role from localStorage
            const token = localStorage.getItem("auth-token");
            const role = localStorage.getItem("auth-role") as UserRole | null;

            return {
                isAuthenticated: !!token,
                user: null,
                role,
                loading: false,
                error: null,

                // Login Function
                login: async (data, role) => {
                    set({ loading: true, error: null });

                    try {
                        const response = await axios.post(`${API_BASE_URL}/auth/${role}/login`, data);
                        const userData = response.data.user;

                        set({
                            isAuthenticated: true,
                            user: userData,
                            role,
                            loading: false,
                        });

                        // ✅ Store in localStorage
                        localStorage.setItem("auth-token", userData.token);
                        localStorage.setItem("auth-role", role);
                    } catch (err: any) {
                        set({ error: err.response?.data?.message || "Login failed", loading: false });
                    }
                },

                // Signup Function
                signup: async (data, role) => {
                    set({ loading: true, error: null });

                    try {
                        const employer = data as EmployerSignupRequest;
                        const form = new FormData();

                        form.append("companyName", employer.companyName);
                        form.append("companyDescription", employer.companyDescription);
                        form.append("companyWebsite", employer.companyWebsite);
                        form.append("companyEmail", employer.companyEmail);
                        form.append("password", employer.password);
                        form.append("otp", employer.otp);
                        form.append("phone", employer.phone);

                        if (employer.coverPage instanceof File) {
                            form.append("coverPage", employer.coverPage);
                        } else {
                            console.error("coverPage is not a valid file");
                        }

                        if (employer.companyLogo instanceof File) {
                            form.append("companyLogo", employer.companyLogo);
                        } else {
                            console.error("companyLogo is not a valid file");
                        }

                        const response = await axios.post(`${API_BASE_URL}/auth/${role}/signup`, form, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });

                        console.log("Signup success:", response.data);
                    } catch (err: any) {
                        console.log("Signup error:", err);
                        toast.error(err.response?.data?.message || "Signup failed")
                        set({ error: err.response?.data?.message || "Signup failed" });
                    } finally {
                        set({ loading: false });
                    }
                },

                // Logout Function
                logout: async () => {
                    try {
                        await axios.post(`${API_BASE_URL}/auth/logout`);
                    } catch (err) {
                        console.error("Logout error:", err);
                    }

                    // ✅ Remove from localStorage
                    localStorage.removeItem("auth-token");
                    localStorage.removeItem("auth-role");

                    set({ isAuthenticated: false, user: null, role: null });
                },
            };
        },
        {
            name: "auth-storage",
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                role: state.role,
            }),
        }
    )
);

// Fetch User Session (React Query)
export const useUser = () => {
    const token = localStorage.getItem("auth-token");

    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            if (!token) return null;

            try {
                const { data } = await axios.get(`${API_BASE_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return data;
            } catch (error: any) {
                localStorage.removeItem("auth-token"); // Remove invalid token
                throw new Error("Session expired. Please log in again." + JSON.stringify(error));
            }
        },
        enabled: !!token,
    });
};
