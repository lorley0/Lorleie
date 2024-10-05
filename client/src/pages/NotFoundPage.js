import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
            <p className="mt-2 text-lg text-gray-700">
                Oops! The page you're looking for does not exist.
            </p>
            <Link to="/" className="mt-6 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
