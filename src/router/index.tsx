import { createBrowserRouter } from 'react-router';

import Layout from '@/components/common/Layout/Layout';
import ChatPage from '@/pages/chat/ChatPage';
import ChatRoomPage from '@/pages/chat-room/ChatRoomPage';
import HomePage from '@/pages/home/HomePage';
import MyPage from '@/pages/my/MyPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import PostSafeZonePage from '@/pages/post-safe-zone/PostSafeZonePage';
import ReportPage from '@/pages/report/ReportPage';
import SafeZoneCodePage from '@/pages/safe-zone-code/SafeZoneCodePage';
import SafeZoneScanPage from '@/pages/safe-zone-scan/SafeZoneScanPage';
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
    children: [
      { path: ROUTES.CHAT_ROOM, element: <ChatRoomPage /> },
      { path: ROUTES.SAFE_ZONE_SCAN, element: <SafeZoneScanPage /> },
      { path: ROUTES.REPORT, element: <ReportPage /> },
      { path: ROUTES.SAFE_ZONE_CODE, element: <SafeZoneCodePage /> },
      { path: ROUTES.POST_SAFE_ZONE, element: <PostSafeZonePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
