import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';

import { ApiError } from '@/api/client';
import mailIcon from '@/assets/images/mail.svg';
import AuthNotice from '@/components/auth/AuthNotice/AuthNotice';
import SignupStep from '@/components/auth/SignupStep/SignupStep';
import VerificationCodeInput from '@/components/auth/VerificationCodeInput/VerificationCodeInput';
import Button from '@/components/common/Button/Button';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import { useResendVerificationMail, useVerifySignup } from '@/hooks/useAuth';
import { useCountdown } from '@/hooks/useCountdown';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';
import { useSignupStore } from '@/store/signupStore';
import type { VerificationMail } from '@/types/auth';
import { cn } from '@/utils/cn';
import { formatCountdown } from '@/utils/formatCountdown';

import './SignupVerifyPage.css';

const CODE_LENGTH = 6;

export default function SignupVerifyPage() {
  const verification = useSignupStore((state) => state.verification);

  if (!verification) return <Navigate to={ROUTES.SIGNUP} replace />;

  // 인증번호를 다시 받으면 새로 마운트해 입력값·타이머·에러를 초기화
  return <SignupVerifyForm key={verification.expiresAt} verification={verification} />;
}

function SignupVerifyForm({ verification }: { verification: VerificationMail }) {
  const navigate = useNavigate();
  const saveLogin = useAuthStore((state) => state.login);
  const updateVerification = useSignupStore((state) => state.updateVerification);
  const verify = useVerifySignup();
  const resend = useResendVerificationMail();
  const [code, setCode] = useState('');
  const remainingSeconds = useCountdown(verification.expiresAt);

  const isExpired = remainingSeconds === 0;
  const error = verify.error ?? resend.error;
  const errorMessage = isExpired
    ? '인증 시간이 지났어요. 인증번호를 다시 받아 주세요'
    : error instanceof ApiError
      ? error.message
      : error
        ? '인증하지 못했어요. 잠시 후 다시 시도해 주세요'
        : null;
  const canSubmit = code.length === CODE_LENGTH && !isExpired && !verify.isPending;

  const handleChange = (value: string) => {
    setCode(value);
    verify.reset();
  };

  const handleResend = () => {
    resend.mutate(verification.email, { onSuccess: updateVerification });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    verify.mutate(
      { email: verification.email, code },
      {
        onSuccess: (user) => {
          saveLogin(user, false);
          navigate(ROUTES.SIGNUP_COMPLETE, { replace: true });
        },
      },
    );
  };

  return (
    <section className="signup-verify-page">
      <PageHeader title="회원가입" onBack={() => navigate(ROUTES.SIGNUP)} />
      <form className="signup-verify-page__form" onSubmit={handleSubmit} noValidate>
        <SignupStep current={2} total={2} label="학교 웹메일 인증" />

        <span className="signup-verify-page__icon">
          <img src={mailIcon} alt="" width={26} height={26} />
        </span>
        <h1 className="signup-verify-page__title">
          메일로 보낸 인증번호
          <br />
          {CODE_LENGTH}자리를 입력해 주세요
        </h1>
        <p className="signup-verify-page__description">
          <strong>{verification.email}</strong>으로 보냈어요.
        </p>

        <VerificationCodeInput
          className="signup-verify-page__code"
          value={code}
          onChange={handleChange}
          length={CODE_LENGTH}
          hasError={Boolean(verify.error)}
        />

        <div className="signup-verify-page__timer-row">
          <p
            className={cn(
              'signup-verify-page__timer',
              isExpired && 'signup-verify-page__timer--expired',
            )}
          >
            남은 시간 <span>{formatCountdown(remainingSeconds)}</span>
          </p>
          <button
            type="button"
            className="signup-verify-page__resend"
            onClick={handleResend}
            disabled={resend.isPending}
          >
            인증번호 다시 받기
          </button>
        </div>
        {errorMessage && (
          <p className="signup-verify-page__error" role="alert">
            {errorMessage}
          </p>
        )}

        <AuthNotice className="signup-verify-page__notice" title="메일이 오지 않았나요?">
          스팸함을 확인하거나, 학교 포털 메일함에서 ‘캠퍼스마켓’을 검색해 보세요.
        </AuthNotice>

        <div className="signup-verify-page__footer">
          <Button type="submit" fullWidth disabled={!canSubmit}>
            인증 완료
          </Button>
        </div>
      </form>
    </section>
  );
}
