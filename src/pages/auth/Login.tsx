import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts"; // Import the hook

export const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const { login } = useAuth();  // Use the custom hook

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        login(credentials.email, credentials.password);  // Call login function
    };

    return (
        <>
            <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    Login
                </button>
            </form>
        </>
    );
};
