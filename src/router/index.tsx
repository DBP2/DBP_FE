import { createBrowserRouter } from 'react-router';

import Layout from '@/components/common/Layout/Layout';
import ChatPage from '@/pages/chat/ChatPage';
import HomePage from '@/pages/home/HomePage';
import MyPage from '@/pages/my/MyPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import TradePage from '@/pages/trade/TradePage';
import { ROUTES } from '@/router/routes';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.TRADE, element: <TradePage /> },
      { path: ROUTES.CHAT, element: <ChatPage /> },
      { path: ROUTES.MY, element: <MyPage /> },
    ],
  },
  {
    element: <Layout showNavBar={false} />,
    children: [{ path: '*', element: <NotFoundPage /> }],
  },
]);
