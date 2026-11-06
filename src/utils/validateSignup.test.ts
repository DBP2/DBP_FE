import { describe, expect, it } from 'vitest';

import { validateSignup, type SignupForm } from '@/utils/validateSignup';

const VALID_FORM: SignupForm = {
  emailId: '20240826',
  password: 'campus1234',
  passwordConfirm: 'campus1234',
  nickname: '연우',
  department: '',
  agreed: true,
};

describe('validateSignup', () => {
  it('모든 값이 올바르면 에러가 없다', () => {
    expect(validateSignup(VALID_FORM)).toEqual({});
  });

  it('이메일 아이디에 허용하지 않는 문자가 있으면 에러', () => {
    expect(validateSignup({ ...VALID_FORM, emailId: 'a@b' }).emailId).toBeDefined();
  });

  it.each(['short1', 'onlyletters', '12345678'])('비밀번호 %s 는 규칙 위반', (password) => {
    expect(validateSignup({ ...VALID_FORM, password, passwordConfirm: password }).password).toBe(
      '영문·숫자 포함 8자 이상으로 입력해 주세요',
    );
  });

  it('비밀번호 확인이 다르면 에러', () => {
    expect(validateSignup({ ...VALID_FORM, passwordConfirm: 'campus12345' }).passwordConfirm).toBe(
      '비밀번호가 일치하지 않아요',
    );
  });

  it('닉네임은 공백 제외 2~10자', () => {
    expect(validateSignup({ ...VALID_FORM, nickname: ' 연 ' }).nickname).toBeDefined();
    expect(
      validateSignup({ ...VALID_FORM, nickname: '가나다라마바사아자차카' }).nickname,
    ).toBeDefined();
  });

  it('약관 미동의 시 에러, 학과는 선택', () => {
    const errors = validateSignup({ ...VALID_FORM, agreed: false });
    expect(errors.agreed).toBeDefined();
    expect(errors.department).toBeUndefined();
  });
});
