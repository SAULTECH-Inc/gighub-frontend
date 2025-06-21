import React from "react";

export const NotFound: React.FC = () => {
  return (
    <div className="bg-gray-100 flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-gray-800 text-9xl font-bold">404</h1>
        <h2 className="text-gray-800 mt-4 text-4xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
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
