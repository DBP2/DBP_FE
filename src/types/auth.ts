export interface AuthUser {
  id: string;
  name: string;
  profileImage: string | null;
  introduction: string | null;
  trustGrade: string;
  schoolVerified: boolean;
  schoolName: string | null;
  trustScore: number;
  admin: boolean;
  status: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface SignupRequest {
  schoolId: string;
  studentNo: string;
  studentName: string;
  userId: string;
  password: string;
  nickname: string;
}

export interface School {
  id: string;
  name: string;
}
