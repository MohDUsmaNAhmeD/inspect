import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Glitch Effect */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-white opacity-20 select-none">
            404
          </h1>
          <h1 className="absolute inset-0 text-[150px] md:text-[200px] font-bold text-red-500 
            animate-glitch-1 select-none">
            404
          </h1>
          <h1 className="absolute inset-0 text-[150px] md:text-[200px] font-bold text-cyan-500 
            animate-glitch-2 select-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            The page you're looking for seems to have vanished into the digital void.
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 
              text-white rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-700 hover:border-gray-600 text-gray-300 
              hover:text-white rounded-lg transition-all duration-300"
          >
            Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
