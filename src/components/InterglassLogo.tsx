import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const InterglassLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = size === 'sm' ? { w: 90, h: 42 } : size === 'lg' ? { w: 140, h: 65 } : { w: 110, h: 50 };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 140 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="IGC Logo"
      >
        {/* Outer Maroon Rounded Shape */}
        <rect x="2" y="2" width="136" height="56" rx="8" stroke="#8A1515" strokeWidth="2.5" fill="#ffffff" />
        
        {/* Oval with horizontal speed lines */}
        <ellipse cx="68" cy="30" rx="60" ry="24" stroke="#8A1515" strokeWidth="2" fill="#fff5f5" />
        
        {/* Horizontal hatch lines behind text */}
        <line x1="15" y1="18" x2="121" y2="18" stroke="#C53030" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="12" y1="24" x2="124" y2="24" stroke="#C53030" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="10" y1="30" x2="126" y2="30" stroke="#C53030" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="12" y1="36" x2="124" y2="36" stroke="#C53030" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="15" y1="42" x2="121" y2="42" stroke="#C53030" strokeWidth="1.2" strokeOpacity="0.4" />

        {/* Outer curved brackets */}
        <path d="M 22 14 Q 10 30 22 46" stroke="#8A1515" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 118 14 Q 130 30 118 46" stroke="#8A1515" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Central IGC Typography */}
        <text
          x="68"
          y="38"
          fill="#8A1515"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="26"
          fontWeight="900"
          letterSpacing="4"
          textAnchor="middle"
          style={{ fontStyle: 'italic' }}
        >
          IGC
        </text>
      </svg>
    </div>
  );
};
