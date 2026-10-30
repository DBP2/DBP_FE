import { createBrowserRouter } from 'react-router';

import { ROUTES } from '@/router/routes';
import HomePage from '@/pages/home/HomePage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: '*', element: <NotFoundPage /> },
]);
