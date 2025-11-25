import React from 'react';

export const InstagramLogo = ({ className = 'w-8 h-8', textSize = 'text-2xl' }) => {
  return (
    <div className="flex items-center gap-2">
      <img src="/instagram-logo.svg" alt="Instagram" className="w-8 h-8" />
      <div className={`${textSize} font-black bg-linear-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent tracking-tight`}>
        Instagram
      </div>
    </div>
  );
};

export const InstagramLogoOnly = ({ size = 'w-12 h-12' }) => {
  return (
    <img src="/instagram-logo.svg" alt="Instagram" className={size} />
  );
};

export const InstagramLogoMark = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      {/* Instagram gradient background */}
      <defs>
        <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="5%" stopColor="#fa7e1e" />
          <stop offset="45%" stopColor="#d92e7f" />
          <stop offset="60%" stopColor="#9b36b7" />
          <stop offset="90%" stopColor="#515bd4" />
        </linearGradient>
      </defs>
      
      {/* Square background */}
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#instagramGradient)" />
      
      {/* Camera circle */}
      <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="1.5" />
      
      {/* Flash point */}
      <circle cx="17" cy="5" r="1" fill="white" />
    </svg>
  );
};

export default InstagramLogo;
