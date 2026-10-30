import { describe, expect, it } from 'vitest';

import { cn } from '@/utils/cn';

describe('cn', () => {
  it('falsy 값을 제외하고 클래스명을 합친다', () => {
    expect(cn('button', false, 'button--primary', undefined, null)).toBe('button button--primary');
  });
});
