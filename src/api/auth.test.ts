import { afterEach, describe, expect, it, vi } from 'vitest';

import { login, resendVerificationMail, sendVerificationMail, verifySignup } from '@/api/auth';
import { VERIFICATION_CODE_MOCK, VERIFICATION_TTL_MS } from '@/mocks/members';

const signupRequest = (email: string) => ({
  email,
  password: 'campus1234',
  nickname: '새내기',
  department: null,
});

afterEach(() => {
  vi.useRealTimers();
});

describe('auth api (mock)', () => {
  it('테스트 계정으로 로그인한다', async () => {
    await expect(
      login({ email: '20240826@dongduk.ac.kr', password: 'campus1234' }),
    ).resolves.toMatchObject({ nickname: '연우' });
  });

  it('비밀번호가 틀리면 401', async () => {
    await expect(
      login({ email: '20240826@dongduk.ac.kr', password: 'wrong1234' }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('이미 가입된 이메일은 인증 메일을 보내지 않는다', async () => {
    await expect(
      sendVerificationMail(signupRequest('20240826@dongduk.ac.kr')),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('인증번호가 맞으면 가입되고 바로 로그인할 수 있다', async () => {
    const email = '20250001@dongduk.ac.kr';
    await sendVerificationMail(signupRequest(email));

    await expect(verifySignup(email, '000000')).rejects.toMatchObject({ status: 400 });
    await expect(verifySignup(email, VERIFICATION_CODE_MOCK)).resolves.toMatchObject({ email });
    await expect(login({ email, password: 'campus1234' })).resolves.toMatchObject({ email });
  });

  it('유효 시간이 지나면 410, 다시 받으면 인증된다', async () => {
    vi.useFakeTimers();
    const email = '20250002@dongduk.ac.kr';
    await sendVerificationMail(signupRequest(email));

    vi.advanceTimersByTime(VERIFICATION_TTL_MS + 1000);
    await expect(verifySignup(email, VERIFICATION_CODE_MOCK)).rejects.toMatchObject({
      status: 410,
    });

    await resendVerificationMail(email);
    await expect(verifySignup(email, VERIFICATION_CODE_MOCK)).resolves.toMatchObject({ email });
  });
});
