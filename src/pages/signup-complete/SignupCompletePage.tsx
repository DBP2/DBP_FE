import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';

import checkIcon from '@/assets/images/check_white.svg';
import mascotImage from '@/assets/images/mascot_cheer.png';
import verifiedIcon from '@/assets/images/shield_icon.svg';
import Avatar from '@/components/common/Avatar/Avatar';
import Button from '@/components/common/Button/Button';
import { SCHOOL_NAME } from '@/constants/school';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';
import { useSignupStore } from '@/store/signupStore';

import './SignupCompletePage.css';

export default function SignupCompletePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const resetSignup = useSignupStore((state) => state.reset);

  useEffect(() => {
    resetSignup();
  }, [resetSignup]);

  if (!user) return <Navigate to={ROUTES.WELCOME} replace />;

  return (
    <section className="signup-complete-page">
      <div className="signup-complete-page__hero">
        <img
          className="signup-complete-page__mascot"
          src={mascotImage}
          alt=""
          width={150}
          height={150}
        />
      </div>

      <span className="signup-complete-page__badge">
        <img src={checkIcon} alt="" width={14} height={14} />
        인증 완료
      </span>
      <h1 className="signup-complete-page__title">환영해요, {user.nickname} 님!</h1>
      <p className="signup-complete-page__description">
        이제 {SCHOOL_NAME} 학우들과
        <br />
        안심하고 거래할 수 있어요.
      </p>

      <div className="signup-complete-page__profile">
        <Avatar name={user.nickname} seed={user.id} size={44} />
        <div className="signup-complete-page__profile-info">
          <p className="signup-complete-page__name">
            {user.nickname}
            <span className="signup-complete-page__verified">
              <img src={verifiedIcon} alt="" width={14} height={14} />
              학교인증
            </span>
          </p>
          <p className="signup-complete-page__meta">
            {[user.email, user.department].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      <div className="signup-complete-page__footer">
        <Button fullWidth onClick={() => navigate(ROUTES.HOME, { replace: true })}>
          거래 시작하기
        </Button>
      </div>
    </section>
  );
}
