import { useMutation } from '@tanstack/react-query';

import { login, resendVerificationMail, sendVerificationMail, verifySignup } from '@/api/auth';
import type { LoginRequest, SignupRequest } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
  });
}

export function useSendVerificationMail() {
  return useMutation({
    mutationFn: (request: SignupRequest) => sendVerificationMail(request),
  });
}

export function useResendVerificationMail() {
  return useMutation({
    mutationFn: (email: string) => resendVerificationMail(email),
  });
}

export function useVerifySignup() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => verifySignup(email, code),
  });
}
