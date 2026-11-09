import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { ApiError } from '@/api/client';
import SignupStep from '@/components/auth/SignupStep/SignupStep';
import BottomBar from '@/components/common/BottomBar/BottomBar';
import Button from '@/components/common/Button/Button';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SelectField from '@/components/common/SelectField/SelectField';
import TextField from '@/components/common/TextField/TextField';
import { DEPARTMENTS, SCHOOL_EMAIL_DOMAIN } from '@/constants/school';
import { useSendVerificationMail } from '@/hooks/useAuth';
import { ROUTES } from '@/router/routes';
import { useSignupStore } from '@/store/signupStore';
import type { SignupRequest } from '@/types/auth';
import { validateSignup, type SignupForm } from '@/utils/validateSignup';

import './SignupPage.css';

// 인증 단계에서 뒤로 돌아오면 입력했던 정보를 다시 채움 (비밀번호·약관 동의는 다시 입력)
const toForm = (request: SignupRequest | null): SignupForm => ({
  emailId: request?.email.split('@')[0] ?? '',
  password: '',
  passwordConfirm: '',
  nickname: request?.nickname ?? '',
  department: request?.department ?? '',
  agreed: false,
});

export default function SignupPage() {
  const navigate = useNavigate();
  const savedRequest = useSignupStore((state) => state.request);
  const startVerification = useSignupStore((state) => state.startVerification);
  const { mutate, isPending, error, reset } = useSendVerificationMail();
  const [form, setForm] = useState<SignupForm>(() => toForm(savedRequest));
  const [touched, setTouched] = useState<Partial<Record<keyof SignupForm, boolean>>>({});

  const errors = validateSignup(form);
  const isValid = Object.keys(errors).length === 0;
  const visibleError = (field: keyof SignupForm) => (touched[field] ? errors[field] : undefined);
  const emailError =
    visibleError('emailId') ?? (error instanceof ApiError ? error.message : undefined);

  const update = <K extends keyof SignupForm>(field: K, value: SignupForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'emailId') reset();
  };
  const touch = (field: keyof SignupForm) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isPending) return;

    const request: SignupRequest = {
      email: `${form.emailId}@${SCHOOL_EMAIL_DOMAIN}`,
      password: form.password,
      nickname: form.nickname.trim(),
      department: form.department || null,
    };
    mutate(request, {
      onSuccess: (verification) => {
        startVerification(request, verification);
        navigate(ROUTES.SIGNUP_VERIFY);
      },
    });
  };

  return (
    <section className="signup-page">
      <PageHeader title="회원가입" onBack={() => navigate(ROUTES.WELCOME)} />
      <form className="signup-page__form" onSubmit={handleSubmit} noValidate>
        <div className="signup-page__body">
          <SignupStep current={1} total={2} label="가입 정보" />
          <h1 className="signup-page__title">가입 정보를 입력해 주세요</h1>
          <p className="signup-page__description">
            학교 이메일로 인증된 계정만 거래 기능을 이용할 수 있어요.
          </p>

          <div className="signup-page__fields">
            <TextField
              label="학교 이메일"
              required
              suffix={`@${SCHOOL_EMAIL_DOMAIN}`}
              placeholder="이메일 아이디"
              value={form.emailId}
              onChange={(event) => update('emailId', event.target.value.trim())}
              onBlur={touch('emailId')}
              error={emailError}
              autoComplete="username"
              autoCapitalize="off"
            />
            <TextField
              label="비밀번호"
              required
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              onBlur={touch('password')}
              hint="영문·숫자 포함 8자 이상이에요"
              error={visibleError('password')}
              autoComplete="new-password"
            />
            <TextField
              label="비밀번호 확인"
              required
              type="password"
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              value={form.passwordConfirm}
              onChange={(event) => update('passwordConfirm', event.target.value)}
              onBlur={touch('passwordConfirm')}
              error={visibleError('passwordConfirm')}
              autoComplete="new-password"
            />
            <div className="signup-page__row">
              <TextField
                label="닉네임"
                required
                placeholder="2~10자"
                maxLength={10}
                value={form.nickname}
                onChange={(event) => update('nickname', event.target.value)}
                onBlur={touch('nickname')}
                error={visibleError('nickname')}
                autoComplete="nickname"
              />
              <SelectField
                label="학과"
                placeholder="선택"
                options={DEPARTMENTS}
                value={form.department}
                onChange={(event) => update('department', event.target.value)}
              />
            </div>
          </div>

          <Checkbox
            className="signup-page__agree"
            checked={form.agreed}
            onChange={(event) => update('agreed', event.target.checked)}
          >
            <strong className="signup-page__required">[필수]</strong> 서비스 이용약관 및 개인정보
            수집에 동의
          </Checkbox>
        </div>
        <BottomBar>
          <Button type="submit" fullWidth disabled={!isValid || isPending}>
            인증 메일 받기
          </Button>
        </BottomBar>
      </form>
    </section>
  );
}
