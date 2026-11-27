import { useMutation, useQuery } from '@tanstack/react-query';

import { getSchools, login, logout, signup } from '@/api/auth';
import type { LoginRequest, SignupRequest } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (request: SignupRequest) => {
      await signup(request);
      return login({ userId: request.userId, password: request.password });
    },
  });
}

export function useSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: getSchools,
    staleTime: Infinity,
  });
}

export function useLogout() {
  return useMutation({ mutationFn: logout });
}
