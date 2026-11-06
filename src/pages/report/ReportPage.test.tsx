import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import ReportPage from '@/pages/report/ReportPage';
import { getReportPath, ROUTES } from '@/router/routes';

const renderReportPage = (path: string) => {
  const router = createMemoryRouter([{ path: ROUTES.REPORT, element: <ReportPage /> }], {
    initialEntries: [path],
  });
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

describe('ReportPage', () => {
  it('거래 정보와 사진 증빙을 보여주고, 유형·사유를 채우면 신고를 접수한다', async () => {
    const user = userEvent.setup();
    renderReportPage(getReportPath('user-2', 'trade-1'));

    expect(await screen.findByText('신고 대상 · 김지훈')).toBeInTheDocument();
    expect(screen.getByText('경제학원론 7판 (맨큐) 거래 · 09.26 신청')).toBeInTheDocument();
    expect(screen.getByText('첨부됨')).toBeInTheDocument();

    const submit = screen.getByRole('button', { name: '신고 접수' });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: /사기/ }));
    expect(screen.getByText('중대 사안으로 분류 → 계정 정지 및 변상 처리')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/상세 사유/), '짧은 사유');
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText(/상세 사유/), '입니다. 연락이 끊겼어요');
    await user.click(submit);

    expect(await screen.findByText('신고가 접수됐어요')).toBeInTheDocument();
  });

  it('거래 정보 없이 들어오면 증빙 카드를 숨긴다', async () => {
    renderReportPage(getReportPath('user-2'));

    expect(await screen.findByText('신고 대상 · 김지훈')).toBeInTheDocument();
    expect(screen.queryByText('첨부됨')).not.toBeInTheDocument();
  });

  it('없는 사용자면 에러를 보여준다', async () => {
    renderReportPage(getReportPath('unknown'));
    expect(await screen.findByText('신고 대상을 불러오지 못했어요')).toBeInTheDocument();
  });
});
