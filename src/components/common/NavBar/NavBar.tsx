import type { CSSProperties } from 'react';
import { NavLink } from 'react-router';

import boardIcon from '@/assets/images/board.svg';
import chatIcon from '@/assets/images/chat.svg';
import infoIcon from '@/assets/images/info.svg';
import transactionIcon from '@/assets/images/trade.svg';
import { ROUTES } from '@/router/routes';
import { cn } from '@/utils/cn';

import './NavBar.css';

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: '게시판', icon: boardIcon },
  { to: ROUTES.TRADE, label: '거래', icon: transactionIcon },
  { to: ROUTES.CHAT, label: '채팅', icon: chatIcon },
  { to: ROUTES.MY, label: '내 정보', icon: infoIcon },
] as const;

export default function NavBar() {
  return (
    <nav className="nav-bar" aria-label="하단 메뉴">
      <ul className="nav-bar__list">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === ROUTES.HOME}
              className={({ isActive }) => cn('nav-bar__tab', isActive && 'nav-bar__tab--active')}
            >
              <span
                className="nav-bar__icon"
                style={{ '--nav-icon': `url("${icon}")` } as CSSProperties}
                aria-hidden="true"
              />
              <span className="nav-bar__label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
