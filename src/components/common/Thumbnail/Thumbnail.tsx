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
  return (
    <img
      className={cn('thumbnail', className)}
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: radius }}
    />
  );
}
