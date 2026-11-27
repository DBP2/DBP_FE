import { useNavigate } from 'react-router';

import bellIcon from '@/assets/images/bell_white.svg';
import bookIcon from '@/assets/images/book.svg';
import chevronRightIcon from '@/assets/images/chevron_right.svg';
import flagIcon from '@/assets/images/flag.svg';
import heartIcon from '@/assets/images/heart.svg';
import logoutIcon from '@/assets/images/logout.svg';
import mailIcon from '@/assets/images/mail_outline.svg';
import mascotImage from '@/assets/images/mascot_profile.png';
import shieldIcon from '@/assets/images/shield_check_white.svg';
import starIcon from '@/assets/images/star.svg';
import swapIcon from '@/assets/images/swap.svg';
import ErrorState from '@/components/common/ErrorState/ErrorState';
import Tag from '@/components/common/Tag/Tag';
import { useLogout } from '@/hooks/useAuth';
import { useMyProfile } from '@/hooks/useMyProfile';
import { ROUTES } from '@/router/routes';
import { useAuthStore } from '@/store/authStore';

import './MyPage.css';

interface MenuItem {
  icon: string;
  label: string;
  value?: string;
  valueSize?: 'sm' | 'md';
}

export default function MyPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearLogin = useAuthStore((state) => state.logout);
  const { mutate: logout } = useLogout();
  const { data: profile, isError, refetch } = useMyProfile();

  const nickname = user?.name ?? '';

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        clearLogin();
        void navigate(ROUTES.LOGIN, { replace: true });
      },
    });
  };

  const menuItems: MenuItem[] = [
    { icon: bookIcon, label: '내 게시글', value: profile ? String(profile.postCount) : undefined },
    { icon: heartIcon, label: '관심 목록', value: profile ? String(profile.wishCount) : undefined },
    { icon: swapIcon, label: '거래 내역' },
    { icon: mailIcon, label: '내 계정 정보', value: user?.id, valueSize: 'sm' },
    { icon: flagIcon, label: '신고 · 제재 내역' },
  ];

  return (
    <section className="my-page">
      <header className="my-page__hero">
        <div className="my-page__top">
          <h1 className="my-page__title">내 정보</h1>
          <button type="button" className="my-page__bell" aria-label="알림">
            <img src={bellIcon} alt="" width={24} height={24} />
          </button>
        </div>
        <div className="my-page__user">
          <span className="my-page__avatar" aria-hidden="true">
            {nickname.charAt(0)}
          </span>
          <div className="my-page__user-info">
            <p className="my-page__nickname">{nickname}</p>
            <div className="my-page__meta">
              {user?.schoolName && <span>{user.schoolName} ·</span>}
              {user?.schoolVerified && (
                <span className="my-page__verified">
                  <img src={shieldIcon} alt="" width={12} height={12} />
                  학교인증
                </span>
              )}
            </div>
          </div>
          <img className="my-page__mascot" src={mascotImage} alt="" />
        </div>
      </header>

      <div className="my-page__body">
        {isError ? (
          <ErrorState
            className="my-page__card"
            message="프로필을 불러오지 못했어요"
            onRetry={() => void refetch()}
          />
        ) : (
          profile && (
            <>
              <div className="my-page__card my-page__trust">
                <div className="my-page__trust-head">
                  <div>
                    <p className="my-page__caption">나의 신뢰등급</p>
                    <div className="my-page__grade">
                      <span className="my-page__grade-letter">{profile.trustGrade}</span>
                      <span className="my-page__rating">
                        <img src={starIcon} alt="" width={16} height={16} />
                        {profile.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {!profile.hasSanction && (
                    <Tag color="green" className="my-page__sanction">
                      제재 이력 없음
                    </Tag>
                  )}
                </div>

                <div
                  className="my-page__progress"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(profile.gradeProgress * 100)}
                >
                  <span
                    className="my-page__progress-bar"
                    style={{ width: `${profile.gradeProgress * 100}%` }}
                  />
                </div>
                {profile.nextGrade && (
                  <p className="my-page__caption my-page__progress-caption">
                    {profile.nextGrade}등급까지{' '}
                    <strong>완료 거래 {profile.tradesToNextGrade}회</strong> 남았어요
                  </p>
                )}

                <hr className="my-page__divider" />

                <dl className="my-page__stats">
                  <div className="my-page__stat">
                    <dt>완료 거래</dt>
                    <dd>{profile.completedTradeCount}</dd>
                  </div>
                  <div className="my-page__stat">
                    <dt>받은 리뷰</dt>
                    <dd>{profile.reviewCount}</dd>
                  </div>
                  <div className="my-page__stat">
                    <dt>기한 내 반납</dt>
                    <dd>{profile.onTimeReturnRate}%</dd>
                  </div>
                </dl>
              </div>

              <div className="my-page__card my-page__keywords">
                <h2 className="my-page__section-title">받은 리뷰 키워드</h2>
                <ul className="my-page__keyword-list">
                  {profile.reviewKeywords.map(({ label, count }) => (
                    <li key={label} className="my-page__keyword">
                      {label}
                      <strong>{count}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )
        )}

        <ul className="my-page__card my-page__menu">
          {menuItems.map(({ icon, label, value, valueSize = 'md' }) => (
            <li key={label}>
              <button type="button" className="my-page__menu-item">
                <img src={icon} alt="" width={20} height={20} />
                <span className="my-page__menu-label">{label}</span>
                {value && (
                  <span className={`my-page__menu-value my-page__menu-value--${valueSize}`}>
                    {value}
                  </span>
                )}
                <img src={chevronRightIcon} alt="" width={18} height={18} />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="my-page__menu-item my-page__menu-item--muted"
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="" width={20} height={20} />
              <span className="my-page__menu-label">로그아웃</span>
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
}
