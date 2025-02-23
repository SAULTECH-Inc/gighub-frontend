import React from "react";

export const NotFound: React.FC = () => {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-800">404</h1>
          <h2 className="text-4xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2">Oops! The page you are looking for does not exist.</p>

          <a
              href="/login"
              className="mt-6 inline-block px-6 py-3 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-all"
          >
            Go Back Home
          </a>
        </div>
      </div>
  );
};
