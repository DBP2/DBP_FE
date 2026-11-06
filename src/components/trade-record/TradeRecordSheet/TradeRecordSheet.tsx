import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import cameraIcon from '@/assets/images/camera.svg';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import Button from '@/components/common/Button/Button';
import ErrorState from '@/components/common/ErrorState/ErrorState';
import InfoList from '@/components/common/InfoList/InfoList';
import OptionCard from '@/components/common/OptionCard/OptionCard';
import Tag, { type TagColor } from '@/components/common/Tag/Tag';
import { useSaveTradeRecord, useTradeRecordInfo } from '@/hooks/useTradeRecord';
import type { TradeStatus } from '@/types/chat';
import type { SafeZoneVerification } from '@/types/safeZone';
import type { TradeAction } from '@/types/tradeRecord';
import { formatMonthDayTime, formatTime24 } from '@/utils/formatDateTime';
import { formatPrice } from '@/utils/formatPrice';

import './TradeRecordSheet.css';

const MAX_PHOTOS = 3;

const STATUS_TAG: Record<TradeStatus, { label: string; color: TagColor }> = {
  requested: { label: '요청됨', color: 'blue' },
  accepted: { label: '수락됨', color: 'green' },
  done: { label: '거래완료', color: 'gray' },
};

const ACTION_OPTIONS: { value: TradeAction; title: string; description: string }[] = [
  { value: 'DROP_OFF', title: '두고가기', description: '판매자가 물품을 넣어요' },
  { value: 'PICK_UP', title: '가져가기', description: '구매자가 물품을 꺼내요' },
];

interface RecordPhoto {
  id: string;
  file: File;
  previewUrl: string;
  takenAt: Date;
}

interface TradeRecordSheetProps {
  open: boolean;
  tradeId: string;
  verification: SafeZoneVerification;
  onClose: () => void;
  onSaved: () => void;
}

export default function TradeRecordSheet({
  open,
  tradeId,
  verification,
  onClose,
  onSaved,
}: TradeRecordSheetProps) {
  const { data: info, isError, refetch } = useTradeRecordInfo(tradeId);
  const { mutateAsync: saveRecord, isPending } = useSaveTradeRecord(tradeId);
  const [selectedAction, setSelectedAction] = useState<TradeAction | null>(null);
  const [photos, setPhotos] = useState<RecordPhoto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);

  const defaultAction: TradeAction | null = info
    ? info.myRole === 'seller'
      ? 'DROP_OFF'
      : 'PICK_UP'
    : null;
  const action = selectedAction ?? defaultAction;
  const photoLabel = action === 'DROP_OFF' ? '보관 사진' : '수령 사진';
  const { safeZone, lockerNumber, verifiedAt } = verification;

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)),
    [],
  );

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setErrorMessage(null);
    setPhotos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        takenAt: new Date(),
      },
    ]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((photo) => photo.id !== id);
    });
  };

  const handleSave = async () => {
    if (!action || photos.length === 0) return;
    setErrorMessage(null);
    try {
      await saveRecord({
        safeZoneId: safeZone.id,
        action,
        photos: photos.map((photo) => photo.file),
      });
      onSaved();
    } catch {
      setErrorMessage('기록을 저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} closeOnDimClick={false}>
      <div className="trade-record-sheet">
        <div className="trade-record-sheet__header">
          <h2 className="trade-record-sheet__title">거래 기록 확인</h2>
          <button
            type="button"
            className="trade-record-sheet__close"
            onClick={onClose}
            aria-label="닫기"
          />
        </div>

        <div className="trade-record-sheet__body">
          <div className="trade-record-sheet__place">
            <span className="trade-record-sheet__place-icon" />
            <div className="trade-record-sheet__place-text">
              <p className="trade-record-sheet__place-name">
                {lockerNumber ? `${safeZone.name} · ${lockerNumber}` : safeZone.name}
              </p>
              <p className="trade-record-sheet__place-status">
                <span className="trade-record-sheet__check" />
                QR 확인 완료 · {formatMonthDayTime(verifiedAt)}
              </p>
            </div>
          </div>

          {isError ? (
            <ErrorState message="거래 정보를 불러오지 못했어요" onRetry={() => void refetch()} />
          ) : (
            info && (
              <InfoList
                items={[
                  { label: '물품명', value: info.postTitle },
                  { label: '거래 유형', value: `구매 · ${formatPrice(info.price)}` },
                  {
                    label: '거래 상태',
                    value: (
                      <Tag color={STATUS_TAG[info.tradeStatus].color}>
                        {STATUS_TAG[info.tradeStatus].label}
                      </Tag>
                    ),
                  },
                ]}
              />
            )
          )}

          <section className="trade-record-sheet__section">
            <h3 className="trade-record-sheet__section-title">
              이 거래에서 물품을 어떻게 처리할까요?
            </h3>
            <div className="trade-record-sheet__actions">
              {ACTION_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  type="radio"
                  name="trade-action"
                  layout="stacked"
                  title={option.title}
                  description={option.description}
                  checked={action === option.value}
                  onChange={() => setSelectedAction(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="trade-record-sheet__section">
            <div className="trade-record-sheet__photo-header">
              <h3 className="trade-record-sheet__section-title">
                {photoLabel} <span className="trade-record-sheet__required">*</span>
              </h3>
              <span className="trade-record-sheet__photo-hint">분쟁 시 증빙으로 저장돼요</span>
            </div>
            <div className="trade-record-sheet__photos">
              {photos.map((photo) => (
                <div key={photo.id} className="trade-record-sheet__photo">
                  <img
                    src={photo.previewUrl}
                    alt={`${photoLabel} ${formatTime24(photo.takenAt)}`}
                  />
                  <span className="trade-record-sheet__photo-time">
                    {formatTime24(photo.takenAt)} 촬영
                  </span>
                  <button
                    type="button"
                    className="trade-record-sheet__photo-remove"
                    onClick={() => removePhoto(photo.id)}
                    aria-label="사진 삭제"
                  />
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className="trade-record-sheet__photo-add"
                  style={{ gridColumn: `span ${MAX_PHOTOS - photos.length}` }}
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <img src={cameraIcon} alt="" width={24} height={24} />
                  {photos.length === 0 ? '사진 촬영' : '추가 촬영'}
                </button>
              )}
              <input
                ref={cameraInputRef}
                className="trade-record-sheet__photo-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
              />
            </div>
          </section>

          <p className="trade-record-sheet__note">
            위 내용이 정확한지 확인한 뒤 저장해 주세요.
            <br />
            저장 후에는 수정할 수 없어요.
          </p>
        </div>

        <div className="trade-record-sheet__footer">
          {errorMessage && <p className="trade-record-sheet__error">{errorMessage}</p>}
          <Button
            fullWidth
            disabled={!info || !action || photos.length === 0 || isPending}
            onClick={() => void handleSave()}
          >
            기록 저장
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
