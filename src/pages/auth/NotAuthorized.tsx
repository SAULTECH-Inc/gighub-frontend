import React from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-light text-dark">
            <div className="p-8 border border-[#E6E6E6] rounded shadow-xl text-center max-w-md bg-white">
                <h1 className="text-5xl font-bold text-dark">403</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-2">Access Denied</h2>
                <p className="mt-4 text-lg text-gray-500">
                    Oops! You don’t have permission to access this page.
                </p>
                <p className="mt-1 text-gray-400">
                    If you think this is a mistake, please contact support.
                </p>

                <button
                    onClick={() => navigate("/",{
                        replace: true,
                    })}
                    className="mt-6 px-6 py-2 text-lg font-semibold text-white bg-primary rounded-md hover:bg-purple-700 transition duration-300"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default NotAuthorized;
