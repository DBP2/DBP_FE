import { MY_USER_ID } from '@/mocks/user';
import type { AuthUser } from '@/types/auth';

export interface MemberMock extends AuthUser {
  password: string;
}

// 백엔드 연결 전 로그인 테스트용 계정: 20240826@dongduk.ac.kr / campus1234
export const MEMBERS_MOCK: MemberMock[] = [
  {
    id: MY_USER_ID,
    email: '20240826@dongduk.ac.kr',
    password: 'campus1234',
    nickname: '연우',
    department: '경영학과',
  },
];

// 인증 메일 대신 사용하는 고정 인증번호
export const VERIFICATION_CODE_MOCK = '123456';

export const VERIFICATION_TTL_MS = 5 * 60 * 1000;
