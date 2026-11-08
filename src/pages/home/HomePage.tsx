import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router';

import searchIcon from '@/assets/images/search.svg';
import bannerImage from '@/assets/images/banner.svg';
import Thumbnail from '@/components/common/Thumbnail/Thumbnail';
import { mockPosts } from '@/mocks/posts';
import { getPostDetailPath, ROUTES } from '@/router/routes';

import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="home-page">
      <h1 className="home-page__title">게시판</h1>

      <button
        type="button"
        className="home-page__search"
        onClick={() => navigate(ROUTES.SEARCH)}
        aria-label="교재 검색 페이지로 이동"
      >
        <img src={searchIcon} alt="" />
        <span>과목명, 교재명을 검색해 보세요</span>
      </button>

      <div className="home-page__banner">
        <img src={bannerImage} alt="새 학기 교재 모아보기" />
      </div>

      <div className="home-page__list-header">
        <h2 className="home-page__list-title">거래 가능한 게시글</h2>

        <span className="home-page__sort">최신순</span>
      </div>

      <div className="home-page__post-list">
        {mockPosts.map((post) => {
          const isPostFavorite = isFavorite(post.id);

          return (
            <div
              className="home-page__post-card"
              key={post.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(getPostDetailPath(String(post.id)))}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;

                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(getPostDetailPath(String(post.id)));
                }
              }}
            >
              <Thumbnail src={post.imageUrl} alt={post.title} size={76} radius={10} />

              <div className="home-page__post-info">
                <h3>{post.title}</h3>

                <p>
                  {post.seller} · {post.createdAt}
                </p>

                <div className="home-page__post-bottom">
                  <strong>{post.price.toLocaleString()}원</strong>

                  <button
                    type="button"
                    className={`home-page__favorite ${
                      isPostFavorite ? 'home-page__favorite--active' : ''
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(post.id);
                    }}
                    aria-label={isPostFavorite ? '찜 취소' : '찜하기'}
                    aria-pressed={isPostFavorite}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={isPostFavorite ? '#EF4444' : 'none'}
                      stroke={isPostFavorite ? '#EF4444' : '#6B7684'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                    </svg>

                    <span>{post.favoriteCount + (isPostFavorite ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
