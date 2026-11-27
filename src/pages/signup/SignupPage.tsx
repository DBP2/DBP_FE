import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { ApiError } from '@/api/client';
import BottomBar from '@/components/common/BottomBar/BottomBar';
import Button from '@/components/common/Button/Button';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SelectField from '@/components/common/SelectField/SelectField';
import TextField from '@/components/common/TextField/TextField';
import { CUSTOM_SCHOOL_OPTION, normalizeSchoolName, SCHOOL_OPTIONS } from '@/constants/school';
import { useSchools, useSignup } from '@/hooks/useAuth';
import { ROUTES } from '@/router/routes';
import { validateSignup, type SignupForm } from '@/utils/validateSignup';

import './SignupPage.css';

const EMPTY_FORM: SignupForm = {
  schoolName: '',
  customSchoolName: '',
  studentNo: '',
  studentName: '',
  userId: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
  agreed: false,
};

const SCHOOL_NOT_FOUND_MESSAGE = '아직 가입할 수 없는 학교예요';

const serverErrorField = (message: string): keyof SignupForm =>
  message.includes('아이디') ? 'userId' : message.includes('닉네임') ? 'nickname' : 'studentNo';

export default function SignupPage() {
  const navigate = useNavigate();
  const { data: schools = [], isError: schoolsFailed } = useSchools();
  const { mutate, isPending, error, reset } = useSignup();
  const [form, setForm] = useState<SignupForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof SignupForm, boolean>>>({});
  const [schoolNotFound, setSchoolNotFound] = useState(false);

  const isCustomSchool = form.schoolName === CUSTOM_SCHOOL_OPTION;

  const errors = validateSignup(form);
  const isValid = Object.keys(errors).length === 0;
  const serverError = error
    ? error instanceof ApiError
      ? { field: serverErrorField(error.message), message: error.message }
      : { field: 'studentNo' as const, message: '가입하지 못했어요. 잠시 후 다시 시도해 주세요' }
    : null;
  const visibleError = (field: keyof SignupForm) =>
    (touched[field] ? errors[field] : undefined) ??
    (serverError?.field === field ? serverError.message : undefined);

  const update = <K extends keyof SignupForm>(field: K, value: SignupForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSchoolNotFound(false);
    reset();
  };
  const touch = (field: keyof SignupForm) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isPending) return;

    const schoolName = normalizeSchoolName(
      isCustomSchool ? form.customSchoolName : form.schoolName,
    );
    const school = schools.find((item) => normalizeSchoolName(item.name) === schoolName);
    if (!school) {
      setSchoolNotFound(true);
      return;
    }

    mutate(
      {
        schoolId: school.id,
        studentNo: form.studentNo.trim(),
        studentName: form.studentName.trim(),
        userId: form.userId,
        password: form.password,
        nickname: form.nickname.trim(),
      },
      {
        onSuccess: (user) => navigate(ROUTES.SIGNUP_COMPLETE, { replace: true, state: { user } }),
      },
    );
  };

  return (
    <section className="signup-page">
      <PageHeader title="회원가입" onBack={() => navigate(ROUTES.WELCOME)} />
      <form className="signup-page__form" onSubmit={handleSubmit} noValidate>
        <div className="signup-page__body">
          <h1 className="signup-page__title">가입 정보를 입력해 주세요</h1>
          <p className="signup-page__description">
            학교·학번·이름으로 재학 중인 학생인지 확인한 뒤 가입돼요.
          </p>

          <div className="signup-page__fields">
            <SelectField
              label="학교"
              required
              placeholder="학교를 선택해 주세요"
              options={[...SCHOOL_OPTIONS, CUSTOM_SCHOOL_OPTION]}
              value={form.schoolName}
              onChange={(event) => update('schoolName', event.target.value)}
              onBlur={touch('schoolName')}
              error={
                schoolsFailed
                  ? '학교 목록을 불러오지 못했어요'
                  : (visibleError('schoolName') ??
                    (schoolNotFound && !isCustomSchool ? SCHOOL_NOT_FOUND_MESSAGE : undefined))
              }
            />
            {isCustomSchool && (
              <TextField
                label="학교 이름"
                required
                placeholder="예) 이화여자대학교"
                value={form.customSchoolName}
                onChange={(event) => update('customSchoolName', event.target.value)}
                onBlur={touch('customSchoolName')}
                error={
                  visibleError('customSchoolName') ??
                  (schoolNotFound ? SCHOOL_NOT_FOUND_MESSAGE : undefined)
                }
                autoComplete="organization"
                autoFocus
              />
            )}
            <div className="signup-page__row">
              <TextField
                label="학번"
                required
                placeholder="학번"
                value={form.studentNo}
                onChange={(event) => update('studentNo', event.target.value)}
                onBlur={touch('studentNo')}
                error={visibleError('studentNo')}
                autoComplete="off"
              />
              <TextField
                label="이름"
                required
                placeholder="실명"
                value={form.studentName}
                onChange={(event) => update('studentName', event.target.value)}
                onBlur={touch('studentName')}
                error={visibleError('studentName')}
                autoComplete="name"
              />
            </div>
            <TextField
              label="아이디"
              required
              placeholder="영어 소문자·숫자·_ 4~20자"
              maxLength={20}
              value={form.userId}
              onChange={(event) => update('userId', event.target.value.trim())}
              onBlur={touch('userId')}
              error={visibleError('userId')}
              autoComplete="username"
              autoCapitalize="off"
            />
            <TextField
              label="비밀번호"
              required
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              onBlur={touch('password')}
              hint="영문·숫자 포함 8자 이상이에요"
              error={visibleError('password')}
              autoComplete="new-password"
            />
            <TextField
              label="비밀번호 확인"
              required
              type="password"
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              value={form.passwordConfirm}
              onChange={(event) => update('passwordConfirm', event.target.value)}
              onBlur={touch('passwordConfirm')}
              error={visibleError('passwordConfirm')}
              autoComplete="new-password"
            />
            <TextField
              label="닉네임"
              required
              placeholder="2~10자"
              maxLength={10}
              value={form.nickname}
              onChange={(event) => update('nickname', event.target.value)}
              onBlur={touch('nickname')}
              hint="채팅·게시글에서 다른 학우에게 보이는 이름이에요"
              error={visibleError('nickname')}
              autoComplete="nickname"
            />
          </div>

          <Checkbox
            className="signup-page__agree"
            checked={form.agreed}
            onChange={(event) => update('agreed', event.target.checked)}
          >
            <strong className="signup-page__required">[필수]</strong> 서비스 이용약관 및 개인정보
            수집에 동의
          </Checkbox>
        </div>
        <BottomBar>
          <Button type="submit" fullWidth disabled={!isValid || isPending}>
            가입하기
          </Button>
        </BottomBar>
      </form>
    </section>
  );
}
