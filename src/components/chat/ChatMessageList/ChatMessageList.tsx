import { Fragment, useEffect, useRef } from 'react';

import ChatMessageItem from '@/components/chat/ChatMessageItem/ChatMessageItem';
import DateDivider from '@/components/chat/DateDivider/DateDivider';
import SystemMessageCard from '@/components/chat/SystemMessageCard/SystemMessageCard';
import type { ChatMessage, ChatRoomPartner } from '@/types/chat';
import { isSameDay, isSameMinute } from '@/utils/formatChatDate';

import './ChatMessageList.css';

const isSameSender = (a: ChatMessage | undefined, b: ChatMessage) =>
  a !== undefined && a.type !== 'SYSTEM' && b.type !== 'SYSTEM' && a.senderId === b.senderId;

interface ChatMessageListProps {
  messages: ChatMessage[];
  partner: ChatRoomPartner;
  myUserId: string;
}

export default function ChatMessageList({ messages, partner, myUserId }: ChatMessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  return (
    <div className="chat-message-list" ref={listRef}>
      {messages.map((message, index) => {
        const prev = messages[index - 1];
        const next = messages[index + 1];
        const showDate = !prev || !isSameDay(prev.createdAt, message.createdAt);

        if (message.type === 'SYSTEM') {
          return (
            <Fragment key={message.id}>
              {showDate && <DateDivider date={message.createdAt} />}
              <SystemMessageCard message={message} />
            </Fragment>
          );
        }

        const isContinued = !showDate && isSameSender(prev, message);
        const hasNextInGroup =
          next !== undefined &&
          isSameSender(message, next) &&
          isSameMinute(message.createdAt, next.createdAt);

        return (
          <Fragment key={message.id}>
            {showDate && <DateDivider date={message.createdAt} />}
            <ChatMessageItem
              message={message}
              partner={partner}
              isMine={message.senderId === myUserId}
              showAvatar={!isContinued}
              showTime={!hasNextInGroup}
              isContinued={isContinued}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
