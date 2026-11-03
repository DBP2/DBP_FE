import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import './Tag.css';

export type TagColor = 'blue' | 'gray';

interface TagProps {
  color?: TagColor;
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export default function Tag({ color = 'gray', size = 'md', children, className }: TagProps) {
  return <span className={cn('tag', `tag--${color}`, `tag--${size}`, className)}>{children}</span>;
}
