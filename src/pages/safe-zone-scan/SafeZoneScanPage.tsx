import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import exitIcon from '@/assets/images/exit.svg';
import flashIcon from '@/assets/images/flash.svg';
import mascotImage from '@/assets/images/qr_icon.svg';
import qrScanIcon from '@/assets/images/qr_scan.svg';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import TradeRecordSheet from '@/components/trade-record/TradeRecordSheet/TradeRecordSheet';
import { useQrScanner } from '@/hooks/useQrScanner';
import { useVerifySafeZone } from '@/hooks/useVerifySafeZone';
import { getSafeZoneCodePath } from '@/router/routes';
import { useSafeZoneVerificationStore } from '@/store/safeZoneVerificationStore';
import { cn } from '@/utils/cn';
import { formatChatTime } from '@/utils/formatChatDate';

import './SafeZoneScanPage.css';

export default function SafeZoneScanPage() {
  const { tradeId = '' } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const { mutateAsync: verify, isPending: isVerifying } = useVerifySafeZone(tradeId);
  const verifiedTradeId = useSafeZoneVerificationStore((state) => state.tradeId);
  const storedVerification = useSafeZoneVerificationStore((state) => state.verification);
  const setVerification = useSafeZoneVerificationStore((state) => state.setVerification);
  const clearVerification = useSafeZoneVerificationStore((state) => state.clearVerification);
  const verification = verifiedTradeId === tradeId ? storedVerification : null;
  const isVerified = verification !== null;
  const [sheetReadyAt, setSheetReadyAt] = useState<string | null>(null);
  const isSheetOpen = isVerified && sheetReadyAt === verification.verifiedAt;

  useEffect(() => {
    if (!verification) return;
    const timer = window.setTimeout(() => setSheetReadyAt(verification.verifiedAt), 700);
    return () => window.clearTimeout(timer);
  }, [verification]);

  const handleDecode = async (value: string) => {
    setScanError(null);
    try {
      const result = await verify({ type: 'QR', value });
      navigator.vibrate?.(80);
      setVerification(tradeId, result);
    } catch (error) {
      setScanError('QR을 확인하지 못했어요. 다시 비춰 주세요.');
      throw error;
    }
  };

  const { status, hasFlash, isFlashOn, toggleFlash, retry } = useQrScanner(
    videoRef,
    handleDecode,
    !isVerified,
  );
  const isCameraOn = status === 'scanning' && !isVerified;

  const renderMessage = () => {
    if (isVerified) {
      return (
        <>
          <h2 className="qr-scan-page__title">QR 확인 완료</h2>
          <p className="qr-scan-page__description">
            {verification.safeZone.name} · {formatChatTime(verification.verifiedAt)}
          </p>
        </>
      );
    }
    if (status === 'denied') {
      return (
        <>
          <h2 className="qr-scan-page__title">카메라 권한이 필요해요</h2>
          <p className="qr-scan-page__description">
            브라우저 설정에서 카메라를 허용하거나
            <br />
            아래에서 코드를 직접 입력해 주세요
          </p>
          <button type="button" className="qr-scan-page__retry" onClick={retry}>
            다시 시도
          </button>
        </>
      );
    }
    if (status === 'unavailable') {
      return (
        <>
          <h2 className="qr-scan-page__title">카메라를 사용할 수 없어요</h2>
          <p className="qr-scan-page__description">
            카메라가 없거나 지원하지 않는 환경이에요
            <br />
            아래에서 코드를 직접 입력해 주세요
          </p>
        </>
      );
    }
    return (
      <>
        <h2 className="qr-scan-page__title">
          {isVerifying ? (
            'QR을 확인하고 있어요'
          ) : (
            <>
              Safe Zone에 붙은 QR코드를
              <br />
              사각형 안에 맞춰 주세요
            </>
          )}
        </h2>
        <p
          className={cn(
            'qr-scan-page__description',
            scanError && 'qr-scan-page__description--error',
          )}
        >
          {scanError ?? '인식되면 거래 기록 확인 창이 바로 열려요'}
        </p>
      </>
    );
  };

  return (
    <section className={cn('qr-scan-page', isCameraOn && 'qr-scan-page--camera')}>
      <video ref={videoRef} className="qr-scan-page__video" muted playsInline />

      <PageHeader
        className="qr-scan-page__header"
        variant="overlay"
        title="QR 스캔"
        backIcon={exitIcon}
        backLabel="닫기"
        onBack={() => {
          clearVerification();
          navigate(-1);
        }}
        right={
          <button
            type="button"
            className={cn('qr-scan-page__flash', isFlashOn && 'qr-scan-page__flash--on')}
            onClick={() => void toggleFlash()}
            disabled={!isCameraOn || !hasFlash}
            aria-label="플래시"
            aria-pressed={isFlashOn}
          >
            <img src={flashIcon} alt="" width={24} height={24} />
          </button>
        }
      />

      <div className="qr-scan-page__main">
        <div className={cn('qr-scan-page__frame', isVerified && 'qr-scan-page__frame--done')}>
          <span className="qr-scan-page__corner qr-scan-page__corner--tl" />
          <span className="qr-scan-page__corner qr-scan-page__corner--tr" />
          <span className="qr-scan-page__corner qr-scan-page__corner--bl" />
          <span className="qr-scan-page__corner qr-scan-page__corner--br" />
          {isVerified ? (
            <span className="qr-scan-page__done" />
          ) : (
            <>
              {!isCameraOn && <img src={qrScanIcon} alt="" width={80} height={80} />}
              {(status === 'starting' || status === 'scanning') && !isVerifying && (
                <span className="qr-scan-page__line" />
              )}
            </>
          )}
        </div>

        <div className="qr-scan-page__message">{renderMessage()}</div>
      </div>

      {isVerified && (
        <TradeRecordSheet
          open={isSheetOpen}
          tradeId={tradeId}
          verification={verification}
          onClose={clearVerification}
          onSaved={() => {
            clearVerification();
            navigate(-1);
          }}
        />
      )}

      {!isVerified && (
        <div className="qr-scan-page__bottom">
          <div className="qr-scan-page__notice">
            <img src={mascotImage} alt="" width={40} height={40} />
            <p>
              QR이 훼손됐거나 인식이 안 되면
              <br />
              보관함 옆 6자리 코드를 입력해도 돼요.
            </p>
          </div>
          <Link className="qr-scan-page__code-link" to={getSafeZoneCodePath(tradeId)}>
            코드 직접 입력하기
          </Link>
        </div>
      )}
    </section>
  );
}
