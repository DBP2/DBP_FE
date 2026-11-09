import { Fragment } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTradeDetail } from '@/hooks/useTrade';
import {
  getReportPath,
  getChatRoomPath,
  getSafeZoneScanPath,
  getTradeReviewPath,
} from '@/router/routes';
import { TRADE_STATUS_LABEL, getTrustGrade, type TradeStatus } from '@/types/trade';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import reportIcon from '@/assets/images/report.svg';
import './TradeDetailPage.css';

const getStepInfo = (status: TradeStatus) => {
  switch (status) {
    case 'REQUESTED':
      return {
        step: 1,
        title: '거래 신청이 완료되었어요.',
        sub: '판매자가 거래를 수락할 때까지 기다려주세요.',
      };
    case 'ACCEPTED':
      return {
        step: 2,
        title: '판매자가 거래를 수락했어요.',
        sub: 'Safe Zone에 물품이 보관되면 알려드릴게요.',
      };
    case 'SAFE_ZONE':
      return {
        step: 3,
        title: 'Safe Zone에 물품이 보관되었어요.',
        sub: '보관함 위치를 확인하고 물품을 찾아가세요.',
      };
    case 'COMPLETED':
      return {
        step: 4,
        title: '거래가 완료되었습니다.',
        sub: '이용해 주셔서 감사합니다.',
      };
    default:
      return { step: 1, title: '', sub: '' };
  }
};

export default function TradeDetailPage() {
  const { tradeId = '' } = useParams();
  const navigate = useNavigate();
  const { data: trade, isPending, isError } = useTradeDetail(tradeId);

  if (isPending || isError || !trade) {
    return (
      <div className="trade-detail">
        <PageHeader title="" />
        <div className="trade-detail__state">
          {isPending ? '로딩 중...' : '거래 정보를 불러올 수 없습니다.'}
        </div>
      </div>
    );
  }

  const stepInfo = getStepInfo(trade.status);
  const currentStep = stepInfo.step;

  // 🎯 액션 버튼 상태 판단 로직
  const isCompleted = trade.status === 'COMPLETED';
  const hasReviewed = Boolean(trade.hasReviewed);

  const handlePrimaryAction = () => {
    if (isCompleted) {
      if (!hasReviewed) {
        navigate(getTradeReviewPath(trade.id));
      }
    } else {
      navigate(getSafeZoneScanPath(trade.id));
    }
  };

  return (
    <div className="trade-detail">
      {/* 1. 상단 헤더 */}
      <PageHeader
        title="거래 상세"
        right={
          <button
            type="button"
            className="trade-detail__report-btn"
            onClick={() => navigate(getReportPath(trade.seller.id))}
            aria-label="신고하기"
          >
            <img src={reportIcon} alt="신고" width={18} height={18} />
          </button>
        }
      />

      <main className="trade-detail__content">
        {/* 2. Stepper 카드 */}
        <section className="trade-detail__stepper-card">
          <div className="trade-detail__stepper-badge">
            거래 진행 중 · {TRADE_STATUS_LABEL[trade.status]}
          </div>
          <h2 className="trade-detail__stepper-title">{stepInfo.title}</h2>
          <p className="trade-detail__stepper-sub">{stepInfo.sub}</p>

          <div className="trade-detail__stepper-steps">
            {[
              { num: 1, label: '신청' },
              { num: 2, label: '수락' },
              { num: 3, label: 'Safe Zone' },
              { num: 4, label: '완료' },
            ].map((stepItem, idx) => {
              const isChecked = stepItem.num <= currentStep;
              const isNextBorder = stepItem.num === currentStep + 1;

              return (
                <Fragment key={stepItem.num}>
                  <div className="trade-detail__step-item">
                    <div
                      className={`trade-detail__step-circle ${
                        isChecked ? 'checked' : isNextBorder ? 'next-border' : 'upcoming'
                      }`}
                    >
                      {isChecked ? '✓' : stepItem.num}
                    </div>
                    <span className="trade-detail__step-label">{stepItem.label}</span>
                  </div>

                  {idx < 3 && (
                    <div
                      className={`trade-detail__step-line ${
                        stepItem.num < currentStep ? 'done' : ''
                      }`}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>

        {/* 3. 상품 요약 카드 */}
        <section
          className="trade-detail__item-card"
          onClick={() => navigate(`/trade/post/${trade.id}`)}
        >
          <div className="trade-detail__item-thumb">
            {trade.imageUrl ? (
              <img src={trade.imageUrl} alt={trade.title} />
            ) : (
              <div className="trade-detail__item-thumb-fallback" />
            )}
          </div>
          <div className="trade-detail__item-info">
            <span className="trade-detail__type-badge">
              {trade.type === 'BUY' ? '구매' : '판매'}
            </span>
            <h3 className="trade-detail__item-title">{trade.title}</h3>
            <div className="trade-detail__item-condition">{trade.conditionSummary}</div>
          </div>
          <div className="trade-detail__item-price">{trade.price.toLocaleString()}원</div>
        </section>

        {/* 4. 거래 당사자 */}
        <section className="trade-detail__section-card">
          <h3 className="trade-detail__section-heading">거래 당사자</h3>

          <div className="trade-detail__user-row">
            <div className="trade-detail__user-avatar seller">
              {trade.seller.nickname.slice(0, 1)}
            </div>
            <div className="trade-detail__user-info">
              <div className="trade-detail__user-name-box">
                <span className="trade-detail__user-role">판매자</span>
                <span className="trade-detail__user-dot">·</span>
                <span className="trade-detail__user-name">
                  {trade.seller.nickname}
                  {trade.myRole === 'SELLER' && ' (나)'}
                </span>
              </div>
              <div className="trade-detail__user-meta">
                {trade.seller.department} · 신뢰등급 {getTrustGrade(trade.seller.trustScore)} (
                {trade.seller.trustScore.toFixed(1)})
              </div>
            </div>
            {trade.seller.isSchoolVerified && (
              <span className="trade-detail__verify-badge">학교인증</span>
            )}
          </div>

          <div className="trade-detail__user-row">
            <div className="trade-detail__user-avatar buyer">
              {trade.buyer.nickname.slice(0, 1)}
            </div>
            <div className="trade-detail__user-info">
              <div className="trade-detail__user-name-box">
                <span className="trade-detail__user-role">구매자</span>
                <span className="trade-detail__user-dot">·</span>
                <span className="trade-detail__user-name">
                  {trade.buyer.nickname}
                  {trade.myRole === 'BUYER' && ' (나)'}
                </span>
              </div>
              <div className="trade-detail__user-meta">
                {trade.buyer.department} · 신뢰등급 {getTrustGrade(trade.buyer.trustScore)} (
                {trade.buyer.trustScore.toFixed(1)})
              </div>
            </div>
            {trade.buyer.isSchoolVerified && (
              <span className="trade-detail__verify-badge">학교인증</span>
            )}
          </div>
        </section>

        {/* 5. 거래 조건 */}
        <section className="trade-detail__section-card">
          <h3 className="trade-detail__section-heading">거래 조건</h3>
          <div className="trade-detail__condition-row">
            <span className="label">가격</span>
            <span className="value bold">{trade.price.toLocaleString()}원</span>
          </div>
          <div className="trade-detail__condition-row">
            <span className="label">거래 장소</span>
            <span className="value highlight">{trade.location}</span>
          </div>
          <div className="trade-detail__condition-row">
            <span className="label">신청일</span>
            <span className="value">{trade.createdAt}</span>
          </div>
        </section>

        {/* 6. 사진 인증 기록 */}
        <section className="trade-detail__section-card">
          <h3 className="trade-detail__section-heading">사진 인증 기록</h3>
          <div className="trade-detail__proof-list">
            {trade.proofRecords.map((proof, idx) => {
              const isCompleted = Boolean(proof.timestamp);

              const fixedTitles = [
                '상품 등록 사진',
                '두고가기 사진 (판매자)',
                '가져가기 사진 (구매자)',
              ];
              const displayTitle = fixedTitles[idx] || proof.title;

              return (
                <div key={proof.id} className="trade-detail__proof-item">
                  <div
                    className={`trade-detail__proof-icon ${isCompleted ? 'completed' : 'pending'}`}
                  >
                    {isCompleted ? '✓' : ''}
                  </div>
                  <div className="trade-detail__proof-info">
                    <span className="trade-detail__proof-title">{displayTitle}</span>
                  </div>
                  <span className="trade-detail__proof-time">{proof.timestamp || '대기 중'}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 7. 하단 버튼 바 */}
      <footer className="trade-detail__footer">
        <button
          type="button"
          className="trade-detail__btn-chat"
          onClick={() => navigate(getChatRoomPath(trade.id))}
        >
          채팅방
        </button>

        <button
          type="button"
          className={`trade-detail__btn-primary ${isCompleted ? 'review' : 'scan'}`}
          disabled={isCompleted && hasReviewed}
          onClick={handlePrimaryAction}
        >
          {isCompleted ? (
            hasReviewed ? (
              '리뷰 작성 완료'
            ) : (
              '리뷰 쓰기'
            )
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <rect x="7" y="7" width="10" height="10" rx="1" />
              </svg>
              Safe Zone 기록하기
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
