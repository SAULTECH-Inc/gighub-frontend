import { useState, useEffect } from "react";

/**
 * A custom hook to manage state with localStorage.
 * @param key The key to store the value in localStorage.
 * @param initialValue The initial value to use if no value is found in localStorage.
 * @returns [storedValue, setStoredValue, removeStoredValue]
 */
function useLocalStorage<T>(key: string, initialValue: T) {
    // Get stored value from localStorage (or use initial value)
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn("Error reading localStorage key:", key, error);
            return initialValue;
        }
    });

    // Update localStorage when the storedValue changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn("Error setting localStorage key:", key, error);
        }
    }, [key, storedValue]);

    // Function to remove item from localStorage
    const removeStoredValue = () => {
        try {
            localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn("Error removing localStorage key:", key, error);
        }
    };

    return [storedValue, setStoredValue, removeStoredValue] as const;
}

export default useLocalStorage;
