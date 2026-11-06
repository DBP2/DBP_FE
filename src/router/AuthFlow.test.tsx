import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { VERIFICATION_CODE_MOCK } from '@/mocks/members';
import LoginPage from '@/pages/login/LoginPage';
import SignupPage from '@/pages/signup/SignupPage';
import SignupCompletePage from '@/pages/signup-complete/SignupCompletePage';
import SignupVerifyPage from '@/pages/signup-verify/SignupVerifyPage';
import WelcomePage from '@/pages/welcome/WelcomePage';
import { GuestOnly, RequireAuth } from '@/router/AuthGuard';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';
import { useSignupStore } from '@/store/signupStore';

const renderApp = (initialPath: string) => {
  const router = createMemoryRouter(
    [
      {
        element: <GuestOnly />,
        children: [
          { path: ROUTES.WELCOME, element: <WelcomePage /> },
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.SIGNUP, element: <SignupPage /> },
        ],
      },
      { path: ROUTES.SIGNUP_VERIFY, element: <SignupVerifyPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: ROUTES.HOME, element: <h1>홈</h1> },
          { path: ROUTES.CHAT, element: <h1>채팅</h1> },
          { path: ROUTES.SIGNUP_COMPLETE, element: <SignupCompletePage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  useAuthStore.getState().logout();
  useSignupStore.getState().reset();
  localStorage.clear();
  sessionStorage.clear();
});

describe('인증 및 온보딩 흐름', () => {
  it('로그인이 필요한 화면은 온보딩으로 보내고, 로그인 후 원래 화면으로 돌아온다', async () => {
    const user = userEvent.setup();
    renderApp(ROUTES.CHAT);

    expect(await screen.findByRole('heading', { name: /안전한 중고거래/ })).toBeInTheDocument();
    await user.click(screen.getAllByRole('link', { name: '로그인' })[0]);

    await user.type(screen.getByLabelText('학교 이메일'), '20240826');
    await user.type(screen.getByLabelText('비밀번호'), 'campus1234');
    await user.click(screen.getByRole('checkbox', { name: '로그인 상태 유지' }));
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByRole('heading', { name: '채팅' })).toBeInTheDocument();
    expect(localStorage.getItem('campusmarket-auth')).toContain('20240826@dongduk.ac.kr');
  });

  it('비밀번호가 틀리면 에러를 보여준다', async () => {
    const user = userEvent.setup();
    renderApp(ROUTES.LOGIN);

    await user.type(screen.getByLabelText('학교 이메일'), '20240826');
    await user.type(screen.getByLabelText('비밀번호'), 'wrong1234');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('이메일 또는 비밀번호가 올바르지 않아요')).toBeInTheDocument();
  });

  it('가입 정보 입력 → 메일 인증 → 가입 완료', async () => {
    const user = userEvent.setup();
    renderApp(ROUTES.SIGNUP);

    const submit = screen.getByRole('button', { name: '인증 메일 받기' });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/학교 이메일/), '20259999');
    await user.type(screen.getByLabelText(/^비밀번호 \*/), 'campus1234');
    await user.type(screen.getByLabelText(/비밀번호 확인/), 'campus1234');
    await user.type(screen.getByLabelText(/닉네임/), '새내기');
    await user.selectOptions(screen.getByLabelText('학과'), '컴퓨터학과');
    await user.click(screen.getByRole('checkbox'));
    await user.click(submit);

    expect(await screen.findByText('20259999@dongduk.ac.kr')).toBeInTheDocument();
    const codeInput = screen.getByLabelText('인증번호 6자리');
    await user.type(codeInput, '000000');
    await user.click(screen.getByRole('button', { name: '인증 완료' }));
    expect(await screen.findByText('인증번호가 일치하지 않아요')).toBeInTheDocument();

    await user.clear(codeInput);
    await user.type(codeInput, VERIFICATION_CODE_MOCK);
    await user.click(screen.getByRole('button', { name: '인증 완료' }));

    expect(await screen.findByText('환영해요, 새내기 님!')).toBeInTheDocument();
    expect(screen.getByText('20259999@dongduk.ac.kr · 컴퓨터학과')).toBeInTheDocument();
    expect(useSignupStore.getState().request).toBeNull();
  });

  it('가입 정보 없이 인증 화면에 들어오면 가입 정보 입력으로 돌려보낸다', async () => {
    renderApp(ROUTES.SIGNUP_VERIFY);
    expect(await screen.findByText('가입 정보를 입력해 주세요')).toBeInTheDocument();
  });
});
