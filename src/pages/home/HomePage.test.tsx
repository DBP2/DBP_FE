import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from '@/pages/home/HomePage';

describe('HomePage', () => {
  it('타이틀을 렌더링한다', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: '게시판' })).toBeInTheDocument();
  });
});
