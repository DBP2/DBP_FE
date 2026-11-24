import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';

// 로그인하지 않은 사용자는 온보딩으로 보내고, 로그인 후 원래 가려던 경로로 돌아오게 함
export function RequireAuth() {
  const isLoggedIn = useAuthStore((state) => state.user !== null);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.WELCOME} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

// 이미 로그인한 사용자는 온보딩·로그인·회원가입 화면 대신 원래 가려던 경로(없으면 홈)로 보냄
export function GuestOnly() {
  const isLoggedIn = useAuthStore((state) => state.user !== null);
  const location = useLocation();

  if (isLoggedIn) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? ROUTES.HOME} replace />;
  }
  return <Outlet />;
}
