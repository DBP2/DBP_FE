import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { ApiError } from '@/api/client';
import qrIcon from '@/assets/images/qr.svg';
import BottomBar from '@/components/common/BottomBar/BottomBar';
import Button from '@/components/common/Button/Button';
import CodeInput from '@/components/common/CodeInput/CodeInput';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import { useVerifySafeZone } from '@/hooks/useVerifySafeZone';
import { getSafeZoneScanPath } from '@/router/routes';
import { useSafeZoneVerificationStore } from '@/store/safeZoneVerificationStore';

import './SafeZoneCodePage.css';

const CODE_LENGTH = 6;

export default function SafeZoneCodePage() {
  const { tradeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: verify, isPending } = useVerifySafeZone(tradeId);
  const setVerification = useSafeZoneVerificationStore((state) => state.setVerification);
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setCode(value);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== CODE_LENGTH || isPending) return;
    try {
      const verification = await verify({ type: 'CODE', value: code });
      setVerification(tradeId, verification);
      if (location.key === 'default') {
        navigate(getSafeZoneScanPath(tradeId), { replace: true });
      } else {
        navigate(-1);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError && error.status === 400
          ? '코드가 맞지 않아요. 보관함 옆 숫자를 다시 확인해 주세요.'
          : '코드를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.',
      );
    }
  };

  return (
    <form className="safe-zone-code-page" onSubmit={(event) => void handleSubmit(event)}>
      <PageHeader title="코드 직접 입력" />
      <div className="safe-zone-code-page__body">
        <span className="safe-zone-code-page__icon">
          <img src={qrIcon} alt="" width={28} height={28} />
        </span>
        <h2 className="safe-zone-code-page__title">
          보관함 옆에 적힌
          <br />
          6자리 코드를 입력해 주세요
        </h2>
        <p className="safe-zone-code-page__description">
          Safe Zone 보관함 QR 스티커 아래에 있어요.
        </p>

        <CodeInput
          className="safe-zone-code-page__code"
          value={code}
          onChange={handleChange}
          length={CODE_LENGTH}
          hasError={errorMessage !== null}
          label="6자리 코드"
          autoFocus
        />
        {errorMessage && <p className="safe-zone-code-page__error">{errorMessage}</p>}

        <div className="safe-zone-code-page__help">
          <p className="safe-zone-code-page__help-title">코드가 보이지 않나요?</p>
          <p className="safe-zone-code-page__help-text">
            QR 스티커 바로 아래 숫자를 확인해 주세요.
            <br />
            훼손됐다면 채팅으로 상대방에게 알려 주세요.
          </p>
        </div>
      </div>

      <BottomBar>
        <Button type="submit" fullWidth disabled={code.length !== CODE_LENGTH || isPending}>
          확인
        </Button>
      </BottomBar>
    </form>
  );
}
