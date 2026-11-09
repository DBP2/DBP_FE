import { useNavigate } from 'react-router';
import { getSafeZoneScanPath, getTradeReviewPath } from '@/router/routes';
import { TRADE_STATUS_LABEL, type TradeItem } from '@/types/trade';
import { cn } from '@/utils/cn';
import './TradeItemCard.css';
import safeZoneGreenIcon from '@/assets/images/safeZone_green.svg';

interface TradeItemCardProps {
  item: TradeItem;
  onClick?: () => void;
}

export default function TradeItemCard({ item, onClick }: TradeItemCardProps) {
  const navigate = useNavigate();

  const isCompleted = item.status === 'COMPLETED';
  const isAccepted = item.status === 'ACCEPTED';
  const isRequested = item.status === 'REQUESTED';
  const isSafeZone = item.status === 'SAFE_ZONE';

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.hasReviewed) return;
    navigate(getTradeReviewPath(item.id));
  };

  const handleNoticeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(getSafeZoneScanPath(item.id));
  };

  return (
    <article
      className={cn('trade-item-card', isCompleted && 'trade-item-card--completed')}
      onClick={onClick}
    >
      <div className="trade-item-card__main">
        <div className="trade-item-card__thumb">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="trade-item-card__image" />
          ) : (
            <div className="trade-item-card__icon-placeholder" />
          )}
        </div>

        <div className="trade-item-card__content">
          <div className="trade-item-card__badges">
            {!isCompleted && (
              <span
                className={cn(
                  'trade-item-card__badge',
                  item.type === 'BUY'
                    ? 'trade-item-card__badge--buy'
                    : 'trade-item-card__badge--sell',
                )}
              >
                {item.type === 'BUY' ? '구매' : '판매'}
              </span>
            )}

            <span
              className={cn(
                'trade-item-card__badge',
                isCompleted
                  ? 'trade-item-card__badge--completed'
                  : 'trade-item-card__badge--status',
              )}
            >
              {TRADE_STATUS_LABEL[item.status]}
            </span>
          </div>

          <h3 className="trade-item-card__title">{item.title}</h3>

          <div className="trade-item-card__meta">
            <span className="trade-item-card__trader">{item.traderName}</span>
            <span className="trade-detail__user-dot">·</span>
            <span className="trade-item-card__price">{item.price.toLocaleString()}원</span>

            {isRequested && item.requestedAt && (
              <>
                <span className="trade-item-card__dot">·</span>
                <span className="trade-item-card__time">{item.requestedAt}</span>
              </>
            )}
          </div>
        </div>

        {isCompleted && (
          <button
            type="button"
            className={cn(
              'trade-item-card__review-btn',
              item.hasReviewed && 'trade-item-card__review-btn--done',
            )}
            disabled={Boolean(item.hasReviewed)}
            onClick={handleReviewClick}
          >
            {item.hasReviewed ? '리뷰 완료' : '리뷰 쓰기'}
          </button>
        )}
      </div>

      {(isAccepted || isSafeZone) && (
        <div className="trade-item-card__notice" onClick={handleNoticeClick}>
          <img src={safeZoneGreenIcon} alt="Safe Zone" className="trade-card__safezone-icon" />
          <span className="trade-item-card__notice-text">
            {isAccepted ? 'Safe Zone 보관 기록이 필요해요' : 'Safe Zone 가져가기 기록이 필요해요'}
          </span>
          <span className="trade-item-card__notice-arrow">›</span>
        </div>
      )}
    </article>
  );
}
