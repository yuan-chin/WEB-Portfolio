'use client';

import './BlackHole.css';

const BlackHole = () => {
  return (
    <div className="blackhole-wrapper">
      <div className="blackhole-rings">
        <div className="bh-ring-3">
          <div className="bh-ring-2">
            <div className="bh-ring-1">
              <div className="bh-core" />
              <div className="bh-glow" />
            </div>
          </div>
        </div>
        <div className="bh-crescents">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <svg key={i} className={`bh-crescent bh-crescent-${i}`} viewBox="0 0 50 50">
              <path d="M 0 0 C 54 50 185 57 226 0 C 198 39 35 32 0 0" fill="#ffffff55" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlackHole;
