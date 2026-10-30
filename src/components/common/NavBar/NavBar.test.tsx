import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import NavBar from '@/components/common/NavBar/NavBar';

describe('NavBar', () => {
  it('4개의 탭을 렌더링한다', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('현재 경로의 탭만 활성화한다', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: '채팅' })).toHaveClass('nav-bar__tab--active');
    expect(screen.getByRole('link', { name: '게시판' })).not.toHaveClass('nav-bar__tab--active');
  });
});
