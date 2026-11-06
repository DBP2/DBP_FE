import { Link, useLocation, useNavigate } from 'react-router';

import appIcon from '@/assets/images/app_icon.png';
import mailIcon from '@/assets/images/mail.svg';
import mascotImage from '@/assets/images/mascot.png';
import messageIcon from '@/assets/images/message.svg';
import qrIcon from '@/assets/images/qr.svg';
import Button from '@/components/common/Button/Button';
import { SCHOOL_NAME } from '@/constants/school';
import { ROUTES } from '@/router/routes';

import './WelcomePage.css';

const TRUST_FEATURES = [
  {
    icon: mailIcon,
    title: '학교 이메일 인증',
    description: '인증된 교내 구성원만 거래에 참여해요',
  },
  {
    icon: qrIcon,
    title: 'Safe Zone QR 거래 기록',
    description: '학내 지정 장소에서 두고가기·가져가기를 기록해요',
  },
  {
    icon: messageIcon,
    title: '구매·채팅을 한 번에',
    description: '신청부터 조건 조율까지 3단계면 끝나요',
  },
];

const TRADE_STEPS = ['게시글\n탐색', '신청 및\n수락', 'Safe Zone\nQR 기록'];

export default function WelcomePage() {
  const navigate = useNavigate();
  // 로그인이 필요한 화면에서 넘어온 경우, 로그인 후 그 화면으로 돌아가도록 state를 넘겨줌
  const { state } = useLocation();

  return (
    <section className="welcome-page">
      <header className="welcome-page__top">
        <span className="welcome-page__brand">
          <img src={appIcon} alt="" width={28} height={28} />
          캠퍼스마켓
        </span>
        <Link className="welcome-page__login-link" to={ROUTES.LOGIN} state={state}>
          로그인
        </Link>
      </header>

      <div className="welcome-page__hero">
        <span className="welcome-page__badge">{SCHOOL_NAME} 학생 전용</span>
        <h1 className="welcome-page__title">
          우리 학교 학생만의
          <br />
          안전한 중고거래
        </h1>
        <p className="welcome-page__description">
          학교 이메일로 인증된 학우끼리
          <br />
          교재·생활용품을 사고팔아 보세요.
        </p>
        <img className="welcome-page__mascot" src={mascotImage} alt="" width={112} height={112} />
      </div>

      <h2 className="welcome-page__section-title">안심하고 거래할 수 있는 이유</h2>
      <ul className="welcome-page__features">
        {TRUST_FEATURES.map((feature) => (
          <li key={feature.title} className="welcome-page__feature">
            <span className="welcome-page__feature-icon">
              <img src={feature.icon} alt="" width={22} height={22} />
            </span>
            <div>
              <h3 className="welcome-page__feature-title">{feature.title}</h3>
              <p className="welcome-page__feature-description">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="welcome-page__section-title">거래는 이렇게 진행돼요</h2>
      <ol className="welcome-page__steps">
        {TRADE_STEPS.map((step, index) => (
          <li key={step} className="welcome-page__step">
            <span className="welcome-page__step-number">{index + 1}</span>
            <span className="welcome-page__step-label">{step}</span>
          </li>
        ))}
      </ol>

      <div className="welcome-page__footer">
        <Button className="welcome-page__start" fullWidth onClick={() => navigate(ROUTES.SIGNUP)}>
          학교 이메일로 시작하기
        </Button>
        <p className="welcome-page__login-guide">
          이미 계정이 있나요?{' '}
          <Link to={ROUTES.LOGIN} state={state}>
            로그인
          </Link>
        </p>
      </div>
    </section>
  );
}
