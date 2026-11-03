import { useNavigate } from 'react-router';

import Button from '@/components/common/Button/Button';
import Tag, { type TagColor } from '@/components/common/Tag/Tag';
import Thumbnail from '@/components/common/Thumbnail/Thumbnail';
import { getTradeDetailPath } from '@/router/routes';
import type { ChatRoomDetail, TradeStatus } from '@/types/chat';
import { formatPrice } from '@/utils/formatPrice';

import './ChatTradeBar.css';

const STATUS_TAG: Record<TradeStatus, { label: string; color: TagColor }> = {
  requested: { label: '요청됨', color: 'blue' },
  accepted: { label: '수락됨', color: 'green' },
  done: { label: '거래완료', color: 'gray' },
};

interface ChatTradeBarProps {
  room: ChatRoomDetail;
}

export default function ChatTradeBar({ room }: ChatTradeBarProps) {
  const navigate = useNavigate();
  const statusTag = STATUS_TAG[room.tradeStatus];

  return (
    <div className="chat-trade-bar">
      <Thumbnail src={room.post.thumbnailUrl} alt={room.post.title} />
      <div className="chat-trade-bar__info">
        <div className="chat-trade-bar__top">
          <Tag color={statusTag.color}>{statusTag.label}</Tag>
          <span className="chat-trade-bar__title">{room.post.title}</span>
        </div>
        <span className="chat-trade-bar__price">{formatPrice(room.post.price)}</span>
      </div>
      <Button variant="soft" size="sm" onClick={() => navigate(getTradeDetailPath(room.tradeId))}>
        거래 상세
      </Button>
    </div>
  );
}
