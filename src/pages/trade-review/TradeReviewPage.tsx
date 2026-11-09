import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTradeDetail, useSubmitReview } from '@/hooks/useTrade';
import './TradeReviewPage.css';

const POSITIVE_TAGS = [
  '설명과 상태가 같아요',
  '응답이 빠르고 친절해요',
  '시간 약속을 잘 지켜요',
  '물품 포장이 꼼꼼해요',
];

const NEGATIVE_TAGS = [
  '상품 상태가 설명과 달라요',
  '응답이 느려요',
  '시간 약속을 안 지켜요',
  '불친절해요',
];

export default function TradeReviewPage() {
  const { tradeId = '' } = useParams();
  const navigate = useNavigate();

  const { data: trade, isPending, isError } = useTradeDetail(tradeId);
  const { mutateAsync: submitReview, isPending: isSubmitting } = useSubmitReview();

  const [rating, setRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (isPending) return <div className="trade-review-modal__state">로딩 중...</div>;
  if (isError || !trade)
    return <div className="trade-review-modal__state">거래 정보를 불러올 수 없습니다.</div>;

  const traderName = trade.myRole === 'BUYER' ? trade.seller.nickname : trade.buyer.nickname;
  const lastProofTime =
    trade.proofRecords.filter((p) => p.timestamp).pop()?.timestamp || '최근 기록 없음';

  const sellerProofCount = trade.proofRecords.filter(
    (p) => p.uploaderRole === 'SELLER' && Boolean(p.timestamp),
  ).length;
  const buyerProofCount = trade.proofRecords.filter(
    (p) => p.uploaderRole === 'BUYER' && Boolean(p.timestamp),
  ).length;
  const proofSummaryText = `보관 ${sellerProofCount}장 · 수령 ${buyerProofCount}장`;

  const currentTags = rating >= 3.5 ? POSITIVE_TAGS : NEGATIVE_TAGS;

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setSelectedTags([]);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleComplete = async () => {
    if (rating === 0) {
      alert('별점을 선택해 주세요.');
      return;
    }

    try {
      await submitReview({
        tradeId,
        rating,
        tags: selectedTags,
      });
      navigate(-1);
    } catch {
      alert('리뷰 제출 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="trade-review-modal">
      <header className="trade-review-modal__header">
        <button
          type="button"
          className="trade-review-modal__close-btn"
          onClick={handleClose}
          aria-label="닫기"
        >
          ✕
        </button>
      </header>

      <main className="trade-review-modal__content">
        {/* 상단 가져가기 기록 영수증 카드 */}
        <div className="trade-review-modal__hero">
          <div className="trade-review-modal__icon-wrapper">
            <span className="trade-review-modal__character">🎓</span>
            <span className="trade-review-modal__check">✓</span>
          </div>
          <h1 className="trade-review-modal__title">가져가기 기록 완료!</h1>
          <p className="trade-review-modal__sub">
            거래가 완료되었어요. 기록은 거래 상세에 보관돼요.
          </p>
        </div>

        <section className="trade-review-modal__info-card">
          <div className="trade-review-modal__info-row">
            <span className="label">장소</span>
            <span className="value">{trade.location}</span>
          </div>
          <div className="trade-review-modal__info-row">
            <span className="label">기록 시각</span>
            <span className="value">{lastProofTime}</span>
          </div>
          <div className="trade-review-modal__info-row">
            <span className="label">인증 사진</span>
            <span className="value highlight">✓ {proofSummaryText}</span>
          </div>
        </section>

        {/* 하단 리뷰 작성 영역 */}
        <section className="trade-review-modal__review-card">
          <h2 className="trade-review-modal__review-title">{traderName} 님과의 거래는 어땠나요?</h2>
          <p className="trade-review-modal__review-sub">남긴 리뷰는 상대방의 신뢰등급에 반영돼요</p>

          <div className="trade-review-modal__rating-box">
            <div className="trade-review-modal__stars">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const fillAmount = Math.max(0, Math.min(1, rating - (starIndex - 1)));
                const fillClass = fillAmount === 1 ? 'full' : fillAmount === 0.5 ? 'half' : 'empty';

                return (
                  <div key={starIndex} className="trade-review-modal__star-wrapper">
                    <button
                      type="button"
                      className="star-half left"
                      onClick={() => handleRatingChange(starIndex - 0.5)}
                    />
                    <button
                      type="button"
                      className="star-half right"
                      onClick={() => handleRatingChange(starIndex)}
                    />
                    <span className={`star-icon ${fillClass}`}>★</span>
                  </div>
                );
              })}
            </div>
          </div>

          {rating > 0 && (
            <div className="trade-review-modal__tags">
              {currentTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`trade-review-modal__tag-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="trade-review-modal__footer">
        <button
          type="button"
          className="trade-review-modal__submit-btn"
          disabled={isSubmitting || rating === 0}
          onClick={handleComplete}
        >
          {isSubmitting ? '제출 중...' : '리뷰 남기고 완료'}
        </button>
        <button type="button" className="trade-review-modal__skip-btn" onClick={handleClose}>
          나중에 할게요
        </button>
      </footer>
    </div>
  );
}
