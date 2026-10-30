import { Outlet } from 'react-router';

import NavBar from '@/components/common/NavBar/NavBar';
import { cn } from '@/utils/cn';

import './Layout.css';

interface LayoutProps {
  showNavBar?: boolean;
}

export default function Layout({ showNavBar = true }: LayoutProps) {
  return (
    <div className="layout">
      <main className={cn('layout__content', showNavBar && 'layout__content--with-nav')}>
        <Outlet />
      </main>
      {showNavBar && <NavBar />}
    </div>
  );
}
