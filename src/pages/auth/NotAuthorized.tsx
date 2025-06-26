import React from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light text-dark flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-md rounded border border-[#E6E6E6] bg-white p-8 text-center shadow-xl">
        <h1 className="text-dark text-5xl font-bold">403</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-700">
          Access Denied
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Oops! You don’t have permission to access this page.
        </p>
        <p className="mt-1 text-gray-400">
          If you think this is a mistake, please contact support.
        </p>

        <button
          onClick={() =>
            navigate("/", {
              replace: true,
            })
          }
          className="bg-primary mt-6 rounded-md px-6 py-2 text-lg font-semibold text-white transition duration-300 hover:bg-purple-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
