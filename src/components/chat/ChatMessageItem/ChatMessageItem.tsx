import { useState } from 'react';

import imageErrorIcon from '@/assets/images/image_error.svg';
import Avatar from '@/components/common/Avatar/Avatar';
import type { ChatRoomPartner, UserMessage } from '@/types/chat';
import { cn } from '@/utils/cn';
import { formatChatTime } from '@/utils/formatChatDate';

import './ChatMessageItem.css';

function MessageImage({ src }: { src: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="chat-message__image chat-message__image--error">
        <img src={imageErrorIcon} alt="" width={24} height={24} />
        <span>사진을 불러올 수 없어요</span>
      </div>
    );
  }

  return (
    <img
      className="chat-message__image"
      src={src}
      alt="보낸 사진"
      onError={() => setHasError(true)}
    />
  );
}

interface ChatMessageItemProps {
  message: UserMessage;
  partner: ChatRoomPartner;
  isMine: boolean;
  showAvatar: boolean;
  showTime: boolean;
  isContinued: boolean;
}

export default function ChatMessageItem({
  message,
  partner,
  isMine,
  showAvatar,
  showTime,
  isContinued,
}: ChatMessageItemProps) {
  return (
    <div
      className={cn(
        'chat-message',
        isMine ? 'chat-message--mine' : 'chat-message--partner',
        isContinued && 'chat-message--continued',
      )}
    >
      {!isMine && (
        <div className="chat-message__avatar">
          {showAvatar && <Avatar name={partner.name} seed={partner.id} size={32} />}
        </div>
      )}
      {message.type === 'TEXT' ? (
        <p className="chat-message__bubble">{message.content}</p>
      ) : (
        <MessageImage key={message.imageUrl} src={message.imageUrl} />
      )}
      {showTime && (
        <time className="chat-message__time" dateTime={message.createdAt}>
          {formatChatTime(message.createdAt)}
        </time>
      )}
    </div>
  );
}
