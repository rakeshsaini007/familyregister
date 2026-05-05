import React from 'react';

export const AppBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[140px] opacity-20 animate-pulse" />
    <div className="absolute top-40 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000" />
    <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[130px] opacity-15 animate-pulse delay-2000" />

    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${10 + Math.random() * 15}s`,
          animationDelay: `${Math.random() * 5}s`,
        } as React.CSSProperties}
      />
    ))}
  </div>
);
