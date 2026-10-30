import { useState } from 'react';

import ChatRoomItem from '@/components/chat/ChatRoomItem/ChatRoomItem';
import SafetyNotice from '@/components/chat/SafetyNotice/SafetyNotice';
import ChipGroup, { type ChipOption } from '@/components/common/ChipGroup/ChipGroup';
import { useChatRooms } from '@/hooks/useChatRooms';
import type { ChatRoom } from '@/types/chat';

import './ChatPage.css';

type ChatFilter = 'all' | 'buy' | 'sell' | 'unread';

const FILTERS: Record<ChatFilter, (room: ChatRoom) => boolean> = {
  all: () => true,
  buy: (room) => room.myRole === 'buyer',
  sell: (room) => room.myRole === 'seller',
  unread: (room) => room.unreadCount > 0,
};

export default function ChatPage() {
  const { data: chatRooms = [], isPending } = useChatRooms();
  const [filter, setFilter] = useState<ChatFilter>('all');

  const unreadCount = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);
  const filterOptions: ChipOption<ChatFilter>[] = [
    { value: 'all', label: '전체' },
    { value: 'buy', label: '구매' },
    { value: 'sell', label: '판매' },
    { value: 'unread', label: unreadCount > 0 ? `안 읽음 ${unreadCount}` : '안 읽음' },
  ];
  const filteredRooms = chatRooms.filter(FILTERS[filter]);

  return (
    <section className="chat-page">
      <h1 className="chat-page__title">채팅</h1>
      <ChipGroup
        className="chat-page__filters"
        options={filterOptions}
        value={filter}
        onChange={setFilter}
      />
      {!isPending && filteredRooms.length === 0 ? (
        <p className="chat-page__empty">채팅이 없어요</p>
      ) : (
        <ul>
          {filteredRooms.map((room) => (
            <ChatRoomItem key={room.id} room={room} />
          ))}
        </ul>
      )}
      <SafetyNotice className="chat-page__notice" />
    </section>
  );
}
