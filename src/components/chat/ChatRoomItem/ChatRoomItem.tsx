import { Link } from 'react-router';

import Avatar from '@/components/common/Avatar/Avatar';
import CountBadge from '@/components/common/CountBadge/CountBadge';
import Tag, { type TagColor } from '@/components/common/Tag/Tag';
import Thumbnail from '@/components/common/Thumbnail/Thumbnail';
import { getChatRoomPath } from '@/router/routes';
import type { ChatRoom, TradeStatus } from '@/types/chat';
import { cn } from '@/utils/cn';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

import './ChatRoomItem.css';

const STATUS_TAG: Record<TradeStatus, { label: string; color: TagColor } | null> = {
  ongoing: null,
  done: { label: '거래완료', color: 'gray' },
};

interface ChatRoomItemProps {
  room: ChatRoom;
}

export default function ChatRoomItem({ room }: ChatRoomItemProps) {
  const { partner, tradeStatus, unreadCount } = room;
  const statusTag = STATUS_TAG[tradeStatus];
  const isUnread = unreadCount > 0;

  return (
    <li>
      <Link
        to={getChatRoomPath(room.id)}
        className={cn(
          'chat-room-item',
          isUnread && 'chat-room-item--unread',
          tradeStatus === 'done' && 'chat-room-item--done',
        )}
      >
        <Avatar name={partner.name} seed={partner.id} />
        <div className="chat-room-item__info">
          <div className="chat-room-item__top">
            <span className="chat-room-item__name">{partner.name}</span>
            {partner.isVerified && (
              <Tag color="blue" size="sm">
                학교인증
              </Tag>
            )}
            {statusTag && (
              <Tag color={statusTag.color} size="sm">
                {statusTag.label}
              </Tag>
            )}
            <span className="chat-room-item__time">· {formatRelativeTime(room.lastMessageAt)}</span>
            <CountBadge className="chat-room-item__badge" count={unreadCount} />
          </div>
          <p className="chat-room-item__message">{room.lastMessage}</p>
        </div>
        <Thumbnail src={room.thumbnailUrl} alt={room.postTitle} />
      </Link>
    </li>
  );
}
