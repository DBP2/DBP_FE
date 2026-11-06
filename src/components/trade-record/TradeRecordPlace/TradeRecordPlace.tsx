import type { SafeZone } from '@/types/safeZone';

import './TradeRecordPlace.css';

interface TradeRecordPlaceProps {
  safeZone: SafeZone;
  lockerNumber: string | null;
  status: string;
}

export default function TradeRecordPlace({
  safeZone,
  lockerNumber,
  status,
}: TradeRecordPlaceProps) {
  return (
    <div className="trade-record-place">
      <span className="trade-record-place__icon" />
      <div className="trade-record-place__text">
        <p className="trade-record-place__name">
          {lockerNumber ? `${safeZone.name} · ${lockerNumber}` : safeZone.name}
        </p>
        <p className="trade-record-place__status">
          <span className="trade-record-place__check" />
          {status}
        </p>
      </div>
    </div>
  );
}
