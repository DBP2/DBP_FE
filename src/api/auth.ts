import { ApiError } from '@/api/client';
import {
  MEMBERS_MOCK,
  VERIFICATION_CODE_MOCK,
  VERIFICATION_TTL_MS,
  type MemberMock,
} from '@/mocks/members';
import type { AuthUser, LoginRequest, SignupRequest, VerificationMail } from '@/types/auth';

interface PendingSignup {
  request: SignupRequest;
  expiresAt: number;
}

const pendingSignups = new Map<string, PendingSignup>();

const toAuthUser = ({ password: _password, ...user }: MemberMock): AuthUser => user;

const findMember = (email: string) => MEMBERS_MOCK.find((member) => member.email === email);

const issueVerification = (request: SignupRequest): VerificationMail => {
  const expiresAt = Date.now() + VERIFICATION_TTL_MS;
  pendingSignups.set(request.email, { request, expiresAt });
  return { email: request.email, expiresAt: new Date(expiresAt).toISOString() };
};

export function login({ email, password }: LoginRequest): Promise<AuthUser> {
  const member = findMember(email);
  if (!member || member.password !== password) {
    return Promise.reject(new ApiError(401, '이메일 또는 비밀번호가 올바르지 않아요'));
  }
  return Promise.resolve(toAuthUser(member));
}

export function sendVerificationMail(request: SignupRequest): Promise<VerificationMail> {
  if (findMember(request.email)) {
    return Promise.reject(new ApiError(409, '이미 가입된 학교 이메일이에요'));
  }
  return Promise.resolve(issueVerification(request));
}

export function resendVerificationMail(email: string): Promise<VerificationMail> {
  const pending = pendingSignups.get(email);
  if (!pending) {
    return Promise.reject(new ApiError(404, '가입 정보를 다시 입력해 주세요'));
  }
  return Promise.resolve(issueVerification(pending.request));
}

export function verifySignup(email: string, code: string): Promise<AuthUser> {
  const pending = pendingSignups.get(email);
  if (!pending) {
    return Promise.reject(new ApiError(404, '가입 정보를 다시 입력해 주세요'));
  }
  if (Date.now() > pending.expiresAt) {
    return Promise.reject(new ApiError(410, '인증 시간이 지났어요. 인증번호를 다시 받아 주세요'));
  }
  if (code !== VERIFICATION_CODE_MOCK) {
    return Promise.reject(new ApiError(400, '인증번호가 일치하지 않아요'));
  }

  const member: MemberMock = { id: crypto.randomUUID(), ...pending.request };
  MEMBERS_MOCK.push(member);
  pendingSignups.delete(email);
  return Promise.resolve(toAuthUser(member));
}
