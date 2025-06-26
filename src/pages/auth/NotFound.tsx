import React from "react";

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="mt-4 text-4xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          Oops! The page you are looking for does not exist.
        </p>

        <a
          href="/login"
          className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 text-white shadow-md transition-all hover:bg-purple-700"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};
