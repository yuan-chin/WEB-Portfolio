'use client';

import './StarBorder.css';
import { ReactNode } from 'react';

interface StarBorderProps {
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children: ReactNode;
  style?: React.CSSProperties;
}

const StarBorder = ({
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  style,
}: StarBorderProps) => {
  return (
    <div
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
    >
      <div
        className="star-border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="star-border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="star-border-inner">{children}</div>
    </div>
  );
};

export default StarBorder;
