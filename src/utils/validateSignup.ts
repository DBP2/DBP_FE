export interface SignupForm {
  schoolName: string;
  studentNo: string;
  studentName: string;
  userId: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  agreed: boolean;
}

export type SignupErrors = Partial<Record<keyof SignupForm, string>>;

export const USER_ID_PATTERN = /^[a-z0-9_]{4,20}$/;

export function validateSignup(form: SignupForm): SignupErrors {
  const errors: SignupErrors = {};
  const nickname = form.nickname.trim();

  if (!form.schoolName) errors.schoolName = '학교를 선택해 주세요';
  if (!form.studentNo.trim()) errors.studentNo = '학번을 입력해 주세요';
  if (!form.studentName.trim()) errors.studentName = '이름을 입력해 주세요';

  if (!form.userId) errors.userId = '아이디를 입력해 주세요';
  else if (!USER_ID_PATTERN.test(form.userId)) {
    errors.userId = '영어 소문자·숫자·_ 4~20자로 입력해 주세요';
  }

  if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = '영문·숫자 포함 8자 이상으로 입력해 주세요';
  }

  if (!form.passwordConfirm) errors.passwordConfirm = '비밀번호를 한 번 더 입력해 주세요';
  else if (form.passwordConfirm !== form.password) {
    errors.passwordConfirm = '비밀번호가 일치하지 않아요';
  }

  if (nickname.length < 2 || nickname.length > 10) errors.nickname = '2~10자로 입력해 주세요';

  if (!form.agreed) errors.agreed = '약관에 동의해 주세요';

  return errors;
}
