import { cn } from '@/utils/cn';

import './Avatar.css';

const hashString = (value: string) => {
  let hash = 0x811c9dc5;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
};

const getAvatarBackground = (seed: string) => {
  const range = hashString(seed) % 300;
  const hue = range < 45 ? range : range + 60;
  return `linear-gradient(135deg, hsl(${hue} 85% 78%) 0%, hsl(${hue - 12} 70% 64%) 100%)`;
};

const getInitial = (name: string) => {
  const trimmed = name.trim();
  return /^[가-힣]{3}$/.test(trimmed) ? trimmed[1] : trimmed.charAt(0);
};

interface AvatarProps {
  name: string;
  seed?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ name, seed = name, size = 50, className }: AvatarProps) {
  return (
    <span
      className={cn('avatar', className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background: getAvatarBackground(seed),
      }}
      aria-hidden="true"
    >
      {getInitial(name)}
    </span>
  );
}
