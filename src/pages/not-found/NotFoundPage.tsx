import { Link } from 'react-router';

import { ROUTES } from '@/router/routes';

import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__description">페이지를 찾을 수 없습니다.</p>
      <Link className="not-found__link" to={ROUTES.HOME}>
        홈으로 돌아가기
      </Link>
    </main>
  );
}
