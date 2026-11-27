import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import checkIcon from '@/assets/images/check_white.svg';
import mascotImage from '@/assets/images/mascot_cheer.png';
import verifiedIcon from '@/assets/images/shield_icon.svg';
import Avatar from '@/components/common/Avatar/Avatar';
import Button from '@/components/common/Button/Button';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';
import type { AuthUser } from '@/types/auth';

import './SignupCompletePage.css';

export default function SignupCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedUser = useAuthStore((state) => state.user);
  const saveLogin = useAuthStore((state) => state.login);
  const signedUpUser = (location.state as { user?: AuthUser } | null)?.user;
  const user = savedUser ?? signedUpUser;

  useEffect(() => {
    if (signedUpUser && !savedUser) saveLogin(signedUpUser, false);
  }, [signedUpUser, savedUser, saveLogin]);

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
      <h1 className="signup-complete-page__title">환영해요, {user.name} 님!</h1>
      <p className="signup-complete-page__description">
        이제 학우들과
        <br />
        안심하고 거래할 수 있어요.
      </p>

      <div className="signup-complete-page__profile">
        <Avatar name={user.name} seed={user.id} size={44} />
        <div className="signup-complete-page__profile-info">
          <p className="signup-complete-page__name">
            {user.name}
            <span className="signup-complete-page__verified">
              <img src={verifiedIcon} alt="" width={14} height={14} />
              학교인증
            </span>
          </p>
          <p className="signup-complete-page__meta">
            {[user.schoolName, user.id].filter(Boolean).join(' · ')}
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
