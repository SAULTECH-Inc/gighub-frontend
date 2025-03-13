import {NODE_ENV} from "./constants.ts";
import secureLocalStorage from "react-secure-storage";

export const calculatePasswordStrength = (password: string): number => {
    let strength = 0;

    // Check for length
    if (password.length >= 8) strength++;

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength++;

    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength++;

    // Check for numbers
    if (/\d/.test(password)) strength++;

    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    return strength;
};

const getAuthToken = () => {
    if (NODE_ENV === 'development') {
        const storage = localStorage.getItem("auth-storage");
        return storage ? JSON.parse(storage).state.authToken : null;
    } else {
        const storage = secureLocalStorage.getItem("auth-storage");
        return storage ? JSON.parse(<string>storage).state.authToken : null;
    }
};

const getUserType = ()=>{
    if (NODE_ENV === 'development') {
        const storage = localStorage.getItem("auth-storage");
        return storage? JSON.parse(storage).state.userType : null;
    } else {
        const storage = secureLocalStorage.getItem("auth-storage");
        return storage? JSON.parse(<string>storage).state.userType : null;
    }
}
export const TOKEN = getAuthToken();
export const USER_TYPE = getUserType();
