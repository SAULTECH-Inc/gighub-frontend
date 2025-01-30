import React, {ButtonHTMLAttributes, ChangeEvent} from "react";

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

export interface TextInputProps {
    label?: string;
    value: string;
    placeholder?: string;
    name?: string;
    type?: React.HTMLInputTypeAttribute; // "text" | "email" | "password" etc.
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}

export interface TextAreaProps {
    label?: string;
    value: string;
    placeholder?: string;
    name?: string;
    rows?: number;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    className?: string;
}

export interface Option {
    label: string;
    value: string;
}

export interface SelectProps {
    label?: string;
    options: Option[];
    value: string;
    name?: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    className?: string;
}

export interface DatePickerProps {
    label?: string;
    value: string;
    name?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
}

export interface ProgressBarProps {
    value: number; // 0 to 100
    className?: string;
    color?: string; // e.g. "bg-blue-600" or "bg-green-500"
}

