import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import plusIcon from '@/assets/images/plus.svg';
import safeZoneIcon from '@/assets/images/safeZone_green.svg';
import sendIcon from '@/assets/images/sendBtn.svg';
import AttachSheet from '@/components/chat/AttachSheet/AttachSheet';
import { getSafeZoneScanPath } from '@/router/routes';

import './ChatComposer.css';

interface ChatComposerProps {
  tradeId: string;
  disabled?: boolean;
  onSendText: (content: string) => Promise<unknown>;
  onSendImage: (file: File) => Promise<unknown>;
}

export default function ChatComposer({
  tradeId,
  disabled = false,
  onSendText,
  onSendImage,
}: ChatComposerProps) {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canSend = text.trim().length > 0 && !disabled;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;
    setErrorMessage(null);
    try {
      await onSendText(text.trim());
      setText('');
    } catch {
      setErrorMessage('메시지를 보내지 못했어요. 다시 시도해 주세요.');
    }
  };

  const handleSelectImage = async (file: File) => {
    setErrorMessage(null);
    try {
      await onSendImage(file);
    } catch {
      setErrorMessage('사진을 보내지 못했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="chat-composer">
      <div className="chat-composer__actions">
        <button
          type="button"
          className="chat-composer__safe-zone"
          onClick={() => navigate(getSafeZoneScanPath(tradeId))}
        >
          <img src={safeZoneIcon} alt="" width={16} height={16} />
          Safe Zone 기록하기
        </button>
      </div>
      {errorMessage && <p className="chat-composer__error">{errorMessage}</p>}
      <form className="chat-composer__form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="chat-composer__attach"
          onClick={() => setIsAttachOpen(true)}
          aria-label="사진 첨부"
        >
          <img src={plusIcon} alt="" width={20} height={20} />
        </button>
        <input
          className="chat-composer__input"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={1000}
        />
        <button
          type="submit"
          className="chat-composer__send"
          disabled={!canSend}
          aria-label="보내기"
        >
          <img src={sendIcon} alt="" width={20} height={20} />
        </button>
      </form>
      <AttachSheet
        open={isAttachOpen}
        onClose={() => setIsAttachOpen(false)}
        onSelect={handleSelectImage}
      />
    </div>
  );
}
