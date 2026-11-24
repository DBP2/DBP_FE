export interface SignupForm {
  emailId: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  department: string;
  agreed: boolean;
}

export type SignupErrors = Partial<Record<keyof SignupForm, string>>;

export const EMAIL_ID_PATTERN = /^[A-Za-z0-9._-]+$/;

export function validateSignup(form: SignupForm): SignupErrors {
  const errors: SignupErrors = {};
  const nickname = form.nickname.trim();

  if (!form.emailId) errors.emailId = '학교 이메일을 입력해 주세요';
  else if (!EMAIL_ID_PATTERN.test(form.emailId)) errors.emailId = '이메일 형식을 확인해 주세요';

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
