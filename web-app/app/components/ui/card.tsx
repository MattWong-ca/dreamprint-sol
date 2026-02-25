import React from 'react';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className={`border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent };
