// components/ui/badge.js
import React from 'react';

export const Badge = ({ variant, className, children }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
};
