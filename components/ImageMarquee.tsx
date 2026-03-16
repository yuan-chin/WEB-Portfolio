'use client';

import { ReactNode } from 'react';
import './ImageMarquee.css';

interface ImageMarqueeProps {
  images: { src: string; alt: string }[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  imageHeight?: number;
}

const ImageMarquee = ({
  images,
  speed = 30,
  direction = 'left',
  className = '',
  imageHeight = 180,
}: ImageMarqueeProps) => {
  // Duplicate the images enough times for seamless loop
  const duplicated = [...images, ...images, ...images];

  return (
    <div className={`img-marquee ${className}`.trim()}>
      <div
        className={`img-marquee-track ${direction === 'right' ? 'img-marquee-right' : ''}`}
        style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
      >
        {duplicated.map((img, i) => (
          <div
            key={i}
            className="img-marquee-item"
            style={{ height: imageHeight }}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageMarquee;
