import React from 'react';

const ChatraIcon = ({ onClick }) => {
  return (
    <div
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-1h1v1zm0-2h-1v-1h1v1zm0-2h-1V9h1v1zm0-2h-1V7h1v1zm-1 6h-1v-1h1v1zm2-4h-1v-1h1v1z" />
        <path d="M21 12a9 9 0 10-9 9h-2a11 11 0 11-11-11v2a9 9 0 102 0h2a9 9 0 10-2 0v2a11 11 0 0111 11h2a9 9 0 009-9z" />
      </svg>
    </div>
  );
};

export default ChatraIcon;
