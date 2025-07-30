import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
          
          {/* Ethiopian flag colors background */}
          <rect x="10" y="20" width="80" height="20" fill="#da121a"/> {/* Red */}
          <rect x="10" y="40" width="80" height="20" fill="#fcdd09"/> {/* Yellow */}
          <rect x="10" y="60" width="80" height="20" fill="#078930"/> {/* Green */}
          
          {/* Japanese characters */}
          <text x="25" y="35" fontSize="12" fill="#e11d48" fontWeight="bold">あ</text>
          <text x="65" y="35" fontSize="12" fill="#92400e" fontWeight="bold">い</text>
          
          {/* Amharic characters */}
          <text x="30" y="75" fontSize="10" fill="#1f2937" fontWeight="bold">ቋ</text>
          <text x="45" y="75" fontSize="10" fill="#1f2937" fontWeight="bold">ን</text>
        </svg>
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-rose-600 tracking-wider">Maya Nihongo</h1>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-600">ቋን</span>
          <span className="text-lg font-semibold text-orange-500">Nihongo</span>
        </div>
      </div>
    </div>
  );
};

export default Logo; 