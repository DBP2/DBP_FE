import { useId, useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router';

import alertIcon from '@/assets/images/alert_orange.svg';
import cameraIcon from '@/assets/images/camera_green.svg';
import Avatar from '@/components/common/Avatar/Avatar';
import BottomBar from '@/components/common/BottomBar/BottomBar';
import Button from '@/components/common/Button/Button';
import ErrorState from '@/components/common/ErrorState/ErrorState';
import OptionCard from '@/components/common/OptionCard/OptionCard';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import TextArea from '@/components/common/TextArea/TextArea';
import {
  REPORT_REASON_MAX_LENGTH,
  REPORT_REASON_MIN_LENGTH,
  REPORT_TYPE_OPTIONS,
} from '@/constants/report';
import { useReportTarget, useSubmitReport } from '@/hooks/useReport';
import { ROUTES } from '@/router/routes';
import type { ReportType } from '@/types/report';
import { cn } from '@/utils/cn';

import './ReportPage.css';

const formatMonthDay = (value: string) => {
  const date = new Date(value);
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

export default function ReportPage() {
  const { userId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const tradeId = searchParams.get('tradeId');
  const navigate = useNavigate();
  const location = useLocation();
  const reasonId = useId();
  const { data: target, isError, refetch } = useReportTarget(userId, tradeId);
  const { mutate, isPending, isSuccess, isError: isSubmitError } = useSubmitReport();
  const [type, setType] = useState<ReportType | null>(null);
  const [reason, setReason] = useState('');
  const [isReasonTouched, setIsReasonTouched] = useState(false);

  const selectedOption = REPORT_TYPE_OPTIONS.find((option) => option.value === type);
  const isReasonValid = reason.trim().length >= REPORT_REASON_MIN_LENGTH;
  const canSubmit = type !== null && isReasonValid && !isPending;

  // 링크로 바로 들어와 이전 기록이 없으면 앱 밖으로 나가지 않도록 채팅 목록으로 이동
  const handleDone = () => {
    if (location.key === 'default') {
      navigate(ROUTES.CHAT, { replace: true });
    } else {
      navigate(-1);
    }
  };

  if (isError) {
    return (
      <section className="report-page">
        <PageHeader className="report-page__header" title="신고하기" />
        <ErrorState message="신고 대상을 불러오지 못했어요" onRetry={() => void refetch()} />
      </section>
    );
  }

  if (!target) return null;

  if (isSuccess) {
    return (
      <section className="report-page report-page--done">
        <h1 className="report-page__done-title">신고가 접수됐어요</h1>
        <p className="report-page__done-description">
          제재 매뉴얼에 따라 검토한 뒤
          <br />
          처리 결과를 알려드릴게요.
        </p>
        <Button className="report-page__done-button" fullWidth onClick={handleDone}>
          확인
        </Button>
      </section>
    );
  }

  const { trade } = target;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || type === null) return;
    mutate({ targetId: target.id, tradeId: trade?.id ?? null, type, reason: reason.trim() });
  };

  return (
    <section className="report-page">
      <PageHeader className="report-page__header" title="신고하기" />
      <form className="report-page__form" onSubmit={handleSubmit} noValidate>
        <div className="report-page__body">
          <div className="report-page__target">
            <Avatar name={target.name} seed={target.id} size={48} />
            <div className="report-page__target-info">
              <p className="report-page__target-name">신고 대상 · {target.name}</p>
              {trade && (
                <p className="report-page__target-trade">
                  {trade.postTitle} 거래 · {formatMonthDay(trade.requestedAt)} 신청
                </p>
              )}
            </div>
          </div>

          <fieldset className="report-page__types">
            <legend className="report-page__section-title">어떤 문제가 있었나요?</legend>
            {REPORT_TYPE_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                type="radio"
                name="report-type"
                title={option.label}
                description={option.description}
                checked={type === option.value}
                onChange={() => setType(option.value)}
              />
            ))}
          </fieldset>

          {selectedOption && (
            <div className="report-page__sanction" role="status">
              <p className="report-page__sanction-title">
                <img src={alertIcon} alt="" width={18} height={18} />
                제재 매뉴얼에 따라 자동 분류돼요
              </p>
              <p className="report-page__sanction-text">{selectedOption.sanction}</p>
            </div>
          )}

          <div className="report-page__reason">
            <label className="report-page__label" htmlFor={reasonId}>
              상세 사유 <span className="report-page__required">*</span>
            </label>
            <TextArea
              id={reasonId}
              className={cn(isReasonTouched && !isReasonValid && 'report-page__textarea--error')}
              placeholder={`상황을 구체적으로 적어 주세요 (${REPORT_REASON_MIN_LENGTH}자 이상)`}
              value={reason}
              maxLength={REPORT_REASON_MAX_LENGTH}
              onChange={(event) => setReason(event.target.value)}
              onBlur={() => setIsReasonTouched(true)}
              aria-invalid={isReasonTouched && !isReasonValid}
            />
            {isReasonTouched && !isReasonValid && (
              <p className="report-page__error">{REPORT_REASON_MIN_LENGTH}자 이상 적어 주세요</p>
            )}
          </div>

          {trade && trade.photoCount > 0 && (
            <div className="report-page__evidence">
              <img src={cameraIcon} alt="" width={20} height={20} />
              <p className="report-page__evidence-text">
                거래 사진 기록 <strong>{trade.photoCount}장</strong>
                <br />이 증빙으로 자동 첨부돼요
              </p>
              <span className="report-page__evidence-badge">첨부됨</span>
            </div>
          )}
        </div>

        <BottomBar
          errorMessage={
            isSubmitError ? '신고를 접수하지 못했어요. 잠시 후 다시 시도해 주세요.' : null
          }
        >
          <Button type="submit" variant="danger" fullWidth disabled={!canSubmit}>
            신고 접수
          </Button>
        </BottomBar>
      </form>
    </section>
  );
}
