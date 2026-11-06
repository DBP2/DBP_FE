import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { ApiError } from '@/api/client';
import AuthNotice from '@/components/auth/AuthNotice/AuthNotice';
import Button from '@/components/common/Button/Button';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import TextField from '@/components/common/TextField/TextField';
import { SCHOOL_EMAIL_DOMAIN } from '@/constants/school';
import { useLogin } from '@/hooks/useAuth';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';

import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const saveLogin = useAuthStore((state) => state.login);
  const { mutate, isPending, error, reset } = useLogin();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? ROUTES.HOME;
  const canSubmit = emailId.trim() !== '' && password !== '' && !isPending;
  const loginError = error
    ? error instanceof ApiError
      ? error.message
      : '로그인하지 못했어요. 잠시 후 다시 시도해 주세요'
    : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    mutate(
      { email: `${emailId.trim()}@${SCHOOL_EMAIL_DOMAIN}`, password },
      {
        onSuccess: (user) => {
          navigate(redirectTo, { replace: true });
          saveLogin(user, keepLogin);
        },
      },
    );
  };

  return (
    <section className="login-page">
      <PageHeader onBack={() => navigate(ROUTES.WELCOME)} />
      <form className="login-page__form" onSubmit={handleSubmit} noValidate>
        <h1 className="login-page__title">다시 만나서 반가워요!</h1>
        <p className="login-page__description">
          학교 이메일로 로그인하고
          <br />
          학우들의 교재와 물품을 둘러보세요.
        </p>

        <div className="login-page__fields">
          <TextField
            label="학교 이메일"
            suffix={`@${SCHOOL_EMAIL_DOMAIN}`}
            placeholder="20240826"
            value={emailId}
            onChange={(event) => {
              setEmailId(event.target.value);
              reset();
            }}
            autoComplete="username"
            autoCapitalize="off"
          />
          <TextField
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              reset();
            }}
            autoComplete="current-password"
            error={loginError}
          />
        </div>

        <Checkbox
          className="login-page__keep"
          checked={keepLogin}
          onChange={(event) => setKeepLogin(event.target.checked)}
        >
          로그인 상태 유지
        </Checkbox>

        <AuthNotice className="login-page__notice">
          학교 이메일 인증을 마친 계정만 로그인할 수 있어요.
        </AuthNotice>

        <div className="login-page__footer">
          <Button type="submit" fullWidth disabled={!canSubmit}>
            로그인
          </Button>
          <div className="login-page__links">
            {/* TODO: 비밀번호 찾기 화면 디자인이 나오면 연결 */}
            <button type="button" className="login-page__link" disabled>
              비밀번호 찾기
            </button>
            <span className="login-page__divider" aria-hidden="true" />
            <Link className="login-page__link" to={ROUTES.SIGNUP}>
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
}
