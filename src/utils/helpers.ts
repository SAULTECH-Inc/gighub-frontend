import {NODE_ENV} from "./constants.ts";
import secureLocalStorage from "react-secure-storage";
import {ISubscription} from "../store/useUserSubscription.ts";
import moment from "moment";
import logger from "../log-config";

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
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength++;

    return strength;
};
export const storage = NODE_ENV === 'development' ? localStorage : secureLocalStorage;
export const getAuthToken = () => {
    if (NODE_ENV === 'development') {
        const storage = localStorage.getItem("auth-storage");
        return storage ? JSON.parse(storage).state.authToken : null;
    } else {
        const storage = secureLocalStorage.getItem("auth-storage");
        return storage ? JSON.parse(<string>storage).state.authToken : null;
    }
};

export const setAuthToken = (token: string) => {
    if (NODE_ENV === 'development') {
        localStorage.setItem("auth-storage", JSON.stringify({state: {authToken: token}}));
    } else {
        secureLocalStorage.setItem("auth-storage", JSON.stringify({state: {authToken: token}}));
    }
}

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

export const checkPasswordStrength = (password: string): number => {
    if (!password || password.length < 6) {
        return -1; // Too weak
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password); // Special characters

    const score =
        Number(hasLower) +
        Number(hasUpper) +
        Number(hasDigit) +
        Number(hasSymbol);

    // Evaluate strength
    if (password.length >= 12 && score === 4) {
        return 2; // Stronger
    } else if (password.length >= 8 && score >= 3) {
        return 1; // Strong
    } else if (password.length >= 6 && score >= 2) {
        return 0; // Weak
    }

    return -1; // Too weak (default fallback)
};

/**
 * Calculates and formats the next subscription date
 * @param subscription - Subscription object
 * @returns string | null - Formatted next subscription date or null if data is missing
 */
export function calculateNextSubscriptionDate(subscription: ISubscription): string | null {
    if (!subscription.createdAt || !subscription.duration) {
        return null;
    }

    const baseDate = moment(subscription.createdAt);
    const nextDate = baseDate.add(subscription.duration, 'months');

    return nextDate.format('MMMM Do, YYYY'); // Example: "November 30th, 2025"
}

export const subCycle = (subscription: ISubscription)=>{
    switch(subscription?.duration){
        case 1:
            return "Month";
        case 3:
            return "Quarter";
        case 6:
            return "Half-Year";
        default:
            return "Year";
    }
}

export const handleError = (error: any)=>{
    if (NODE_ENV === 'production') {
        logger.error(error.response?.data?.message || 'Unknown error occurred');
    } else {
        // toast.error(error.response?.data?.message || 'Failed to fetch job preferences');
    }
}

