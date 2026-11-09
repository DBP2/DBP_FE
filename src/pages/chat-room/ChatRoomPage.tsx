import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import reportIcon from '@/assets/images/report.svg';
import verifiedIcon from '@/assets/images/shield_icon.svg';
import ChatComposer from '@/components/chat/ChatComposer/ChatComposer';
import ChatMessageList from '@/components/chat/ChatMessageList/ChatMessageList';
import ChatTradeBar from '@/components/chat/ChatTradeBar/ChatTradeBar';
import ErrorState from '@/components/common/ErrorState/ErrorState';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import {
  useChatMessages,
  useChatRoom,
  useReadChatRoom,
  useSendImageMessage,
  useSendTextMessage,
} from '@/hooks/useChatRoom';
import { getReportPath } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';

import './ChatRoomPage.css';

export default function ChatRoomPage() {
  const { roomId = '' } = useParams();
  const navigate = useNavigate();
  const myUserId = useAuthStore((state) => state.userId);
  const { data: room, isError, refetch: refetchRoom } = useChatRoom(roomId);
  const {
    data: messages = [],
    isError: isMessagesError,
    refetch: refetchMessages,
  } = useChatMessages(roomId);
  const { mutate: readRoom } = useReadChatRoom(roomId);
  const sendText = useSendTextMessage(roomId);
  const sendImage = useSendImageMessage(roomId);

  useEffect(() => {
    readRoom();
  }, [readRoom, messages.length]);

  if (isError) {
    return (
      <section className="chat-room-page">
        <PageHeader />
        <ErrorState message="채팅방을 불러오지 못했어요" onRetry={() => void refetchRoom()} />
      </section>
    );
  }

  if (!room) return null;

  const { partner } = room;

  return (
    <section className="chat-room-page">
      <div className="chat-room-page__top">
        <PageHeader
          className="chat-room-page__header"
          title={
            <>
              <span className="chat-room-page__name">{partner.name}</span>
              {partner.isVerified && (
                <img src={verifiedIcon} alt="학교인증" width={16} height={16} />
              )}
            </>
          }
          subtitle={partner.trustGrade && `신뢰등급 ${partner.trustGrade}`}
          right={
            <button
              type="button"
              className="chat-room-page__report"
              onClick={() => navigate(getReportPath(partner.id, room.tradeId))}
              aria-label="신고하기"
            >
              <img src={reportIcon} alt="" width={16} height={16} />
            </button>
          }
        />
        <ChatTradeBar room={room} />
      </div>
      {isMessagesError ? (
        <ErrorState
          className="chat-room-page__messages-error"
          message="메시지를 불러오지 못했어요"
          onRetry={() => void refetchMessages()}
        />
      ) : (
        <ChatMessageList messages={messages} partner={partner} myUserId={myUserId} />
      )}
      <ChatComposer
        tradeId={room.tradeId}
        disabled={sendText.isPending}
        onSendText={sendText.mutateAsync}
        onSendImage={sendImage.mutateAsync}
      />
    </section>
  );
}
