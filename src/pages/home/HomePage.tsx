import { useState } from 'react';
import { useNavigate } from 'react-router';

import searchIcon from '@/assets/images/search.svg';
import bannerImage from '@/assets/images/banner.svg';
import Thumbnail from '@/components/common/Thumbnail/Thumbnail';
import { mockPosts } from '@/mocks/posts';
import { ROUTES } from '@/router/routes';

import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (postId: number) => {
    setFavorites((previous) =>
      previous.includes(postId) ? previous.filter((id) => id !== postId) : [...previous, postId],
    );
  };

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
          const isFavorite = favorites.includes(post.id);

          return (
            <div className="home-page__post-card" key={post.id}>
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
                      isFavorite ? 'home-page__favorite--active' : ''
                    }`}
                    onClick={() => toggleFavorite(post.id)}
                    aria-label={isFavorite ? '찜 취소' : '찜하기'}
                    aria-pressed={isFavorite}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={isFavorite ? '#EF4444' : 'none'}
                      stroke={isFavorite ? '#EF4444' : '#6B7684'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                    </svg>

                    <span>{post.favoriteCount + (isFavorite ? 1 : 0)}</span>
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
