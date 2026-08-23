import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showTagline = false }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const textMain = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const textSub = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Logo Mark: Blue Emblem */}
      <div className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 p-[1.5px] shadow-md shadow-blue-950/20`}>
        <div className="w-full h-full bg-blue-950 rounded-[10px] flex items-center justify-center relative overflow-hidden group">
          {/* Inner subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          
          {/* Stylized Aperture / Film Camera Glyph */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-5 h-5 text-blue-300 fill-current relative z-10 transition-transform duration-500 group-hover:rotate-45"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z" opacity="0.3"/>
            <circle cx="12" cy="12" r="3.5" className="text-blue-300" />
            <polygon points="12,6 14,9 10,9" fill="#93C5FD" />
            <polygon points="18,12 15,14 15,10" fill="#93C5FD" />
            <polygon points="12,18 10,15 14,15" fill="#93C5FD" />
            <polygon points="6,12 9,10 9,14" fill="#93C5FD" />
          </svg>
          
          {/* Live Recording Accent Dot */}
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        </div>
      </div>

      {/* Typography Brand Name */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className={`font-syne font-extrabold tracking-tight ${textMain} text-slate-900`}>
            OJIS
          </span>
          <span className={`font-outfit font-bold tracking-tight ${textMain} text-blue-900`}>
            Media
          </span>
        </div>
        <div className={`flex items-center gap-1.5 ${textSub} font-semibold uppercase tracking-[0.22em] text-slate-500 leading-none mt-1`}>
          <span>Academy</span>
          <span className="w-1 h-1 rounded-full bg-blue-600" />
          <span className="text-blue-700 font-medium">Nigeria</span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 font-normal mt-1">
            Learn • Create • Build Your Future
          </span>
        )}
      </div>
    </div>
  );
};

