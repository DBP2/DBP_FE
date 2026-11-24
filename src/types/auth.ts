export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
  department: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  department: string | null;
}

export interface VerificationMail {
  email: string;
  expiresAt: string;
}
