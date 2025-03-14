import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800">
        404 - Page Not Found
      </h1>
      <button
        onClick={handleGoBack}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
