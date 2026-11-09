import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import Button from '@/components/common/Button/Button';
import InfoList from '@/components/common/InfoList/InfoList';
import Tag from '@/components/common/Tag/Tag';
import RecordPhoto from '@/components/trade-record/RecordPhoto/RecordPhoto';
import TradeRecordPlace from '@/components/trade-record/TradeRecordPlace/TradeRecordPlace';
import {
  TRADE_ACTION_LABEL,
  TRADE_ACTION_PHOTO_LABEL,
  TRADE_STATUS_TAG,
} from '@/constants/tradeRecord';
import { useTradeRecordInfo } from '@/hooks/useTradeRecord';
import type { TradeRecord } from '@/types/tradeRecord';
import { formatMonthDayTime } from '@/utils/formatDateTime';
import { formatPrice } from '@/utils/formatPrice';

import '@/components/trade-record/TradeRecordSheet/TradeRecordSheet.css';

interface SavedTradeRecordSheetProps {
  open: boolean;
  record: TradeRecord;
  onClose: () => void;
}

export default function SavedTradeRecordSheet({
  open,
  record,
  onClose,
}: SavedTradeRecordSheetProps) {
  const { data: info } = useTradeRecordInfo(record.tradeId);
  const photoLabel = TRADE_ACTION_PHOTO_LABEL[record.action];

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="trade-record-sheet">
        <div className="trade-record-sheet__header">
          <h2 className="trade-record-sheet__title">내 거래 기록</h2>
          <button
            type="button"
            className="trade-record-sheet__close"
            onClick={onClose}
            aria-label="닫기"
          />
        </div>

        <div className="trade-record-sheet__body">
          <TradeRecordPlace
            safeZone={record.safeZone}
            lockerNumber={record.lockerNumber}
            status={`기록 완료 · ${formatMonthDayTime(record.recordedAt)}`}
          />

          <InfoList
            items={[
              ...(info
                ? [
                    { label: '물품명', value: info.postTitle },
                    { label: '거래 유형', value: `구매 · ${formatPrice(info.price)}` },
                    {
                      label: '거래 상태',
                      value: (
                        <Tag color={TRADE_STATUS_TAG[info.tradeStatus].color}>
                          {TRADE_STATUS_TAG[info.tradeStatus].label}
                        </Tag>
                      ),
                    },
                  ]
                : []),
              { label: '처리 방식', value: TRADE_ACTION_LABEL[record.action] },
            ]}
          />

          <section className="trade-record-sheet__section">
            <div className="trade-record-sheet__photo-header">
              <h3 className="trade-record-sheet__section-title">{photoLabel}</h3>
              <span className="trade-record-sheet__photo-hint">
                {record.photoUrls.length}장 저장됨
              </span>
            </div>
            <div className="trade-record-sheet__photos">
              {record.photoUrls.map((url, index) => (
                <RecordPhoto key={url} src={url} alt={`${photoLabel} ${index + 1}`} />
              ))}
            </div>
          </section>

          <p className="trade-record-sheet__note">
            저장된 기록은 수정할 수 없어요.
            <br />
            문제가 있으면 채팅으로 상대방에게 알려 주세요.
          </p>
        </div>

        <div className="trade-record-sheet__footer">
          <Button fullWidth onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
