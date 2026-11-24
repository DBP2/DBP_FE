export const REPORT_USERS_MOCK: Record<string, string> = {
  'user-1': '이민서',
  'user-2': '김지훈',
  'user-3': '박서연',
  'user-4': '최하은',
  'user-5': '정유진',
};

// 거래별 신청일과 Safe Zone 사진 기록 수 (신고 시 증빙으로 자동 첨부)
export const REPORT_TRADES_MOCK: Record<
  string,
  { userId: string; postTitle: string; requestedAt: string; photoCount: number }
> = {
  'trade-1': {
    userId: 'user-2',
    postTitle: '경제학원론 7판 (맨큐)',
    requestedAt: '2026-09-26T14:10:00+09:00',
    photoCount: 2,
  },
  'trade-2': {
    userId: 'user-3',
    postTitle: '회계원리 교재 세트',
    requestedAt: '2026-09-28T10:00:00+09:00',
    photoCount: 0,
  },
  'trade-3': {
    userId: 'user-4',
    postTitle: '데이터베이스 개론 3판',
    requestedAt: '2026-10-02T18:30:00+09:00',
    photoCount: 1,
  },
  'trade-4': {
    userId: 'user-1',
    postTitle: '미시경제학 2판',
    requestedAt: '2026-09-18T12:00:00+09:00',
    photoCount: 2,
  },
};
