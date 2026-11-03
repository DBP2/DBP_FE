import { useState } from 'react';

import imageErrorIcon from '@/assets/images/image_error.svg';
import { cn } from '@/utils/cn';

import './Thumbnail.css';

interface ThumbnailProps {
  src: string;
  alt: string;
  size?: number;
  radius?: number;
  className?: string;
}

export default function Thumbnail({ src, alt, size = 44, radius = 10, className }: ThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const style = { width: size, height: size, borderRadius: radius };

  if (failedSrc === src) {
    return (
      <span
        className={cn('thumbnail', 'thumbnail--error', className)}
        style={style}
        role="img"
        aria-label={alt}
      >
        <img
          src={imageErrorIcon}
          alt=""
          width={Math.round(size * 0.45)}
          height={Math.round(size * 0.45)}
        />
      </span>
    );
  }

  return (
    <img
      className={cn('thumbnail', className)}
      src={src}
      alt={alt}
      style={style}
      onError={() => setFailedSrc(src)}
    />
  );
}
