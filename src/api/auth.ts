import { request } from '@/api/client';
import type { AuthUser, LoginRequest, School, SignupRequest } from '@/types/auth';

export function login(body: LoginRequest): Promise<AuthUser> {
  return request<AuthUser>('/login', { method: 'POST', body: JSON.stringify(body) });
}

export function logout(): Promise<void> {
  return request<void>('/logout', { method: 'POST' });
}

export function getMe(): Promise<AuthUser> {
  return request<AuthUser>('/users/me');
}

export function getSchools(): Promise<School[]> {
  return request<School[]>('/schools');
}

export function signup(body: SignupRequest): Promise<AuthUser> {
  return request<AuthUser>('/users', { method: 'POST', body: JSON.stringify(body) });
}
