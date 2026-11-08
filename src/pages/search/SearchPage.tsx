import { useState } from 'react';
import { useNavigate } from 'react-router';

import searchIcon from '@/assets/images/search.svg';
import Thumbnail from '@/components/common/Thumbnail/Thumbnail';
import { mockPosts } from '@/mocks/posts';
import { getPostDetailPath, ROUTES } from '@/router/routes';
import { useFavorites } from '@/hooks/useFavorites';

import './SearchPage.css';

type SortType = 'relevance' | 'latest' | 'low' | 'high' | 'favorite';

export default function SearchPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('전체');
  const [subject, setSubject] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortType>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const departments = [
    '전체',
    '인문대학',
    '사회과학대학',
    '경영학과',
    '자연정보과학대학',
    '약학대학',
    '예술대학',
    '디자인이노베이션대학',
    '공연예술대학',
    '문화지식융합대학',
    '미래인재융합대학',
  ];

  const resetFilters = () => {
    setDepartment('전체');
    setSubject('');
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredPosts = mockPosts
    .filter((post) => {
      const keyword = searchQuery.trim().toLowerCase();
      const subjectKeyword = subject.trim().toLowerCase();

      const matchesSearch = post.title.toLowerCase().includes(keyword);
      const matchesDepartment = department === '전체' || post.seller === department;
      const matchesSubject = post.title.toLowerCase().includes(subjectKeyword);
      const matchesMinPrice = minPrice === '' || post.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || post.price <= Number(maxPrice);

      return (
        matchesSearch && matchesDepartment && matchesSubject && matchesMinPrice && matchesMaxPrice
      );
    })
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;

      if (sort === 'favorite') {
        const aCount = a.favoriteCount + (favorites.includes(a.id) ? 1 : 0);
        const bCount = b.favoriteCount + (favorites.includes(b.id) ? 1 : 0);

        return bCount - aCount;
      }

      if (sort === 'latest') return b.id - a.id;

      return 0;
    });

  return (
    <section className="search-page">
      <div className="search-page__header">
        <button
          type="button"
          className="search-page__back"
          onClick={() => navigate(ROUTES.HOME)}
          aria-label="게시판으로 돌아가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="search-page__search">
          <img src={searchIcon} alt="" />

          <input
            type="search"
            placeholder="과목명, 교재명을 검색해 보세요"
            aria-label="교재 검색"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="search-page__filter-bar">
        <button
          type="button"
          className={`search-page__filter-button ${
            showFilters ? 'search-page__filter-button--active' : ''
          }`}
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 17h16M8 4v6M16 14v6" />
          </svg>
          필터
        </button>

        <span className="search-page__filter-summary">
          {department !== '전체' ? department : '전체 학과'}
          {subject && ` · ${subject}`}
          {(minPrice || maxPrice) && ' · 가격 설정'}
        </span>
      </div>

      {showFilters && (
        <div className="search-page__filters">
          <label htmlFor="department">학과</label>
          <select
            id="department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="subject">과목명</label>
          <input
            id="subject"
            type="text"
            placeholder="과목명을 입력하세요"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />

          <label>가격 범위</label>
          <div className="search-page__price-range">
            <input
              type="number"
              min="0"
              placeholder="최저가"
              aria-label="최저가"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
            <span>~</span>
            <input
              type="number"
              min="0"
              placeholder="최고가"
              aria-label="최고가"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </div>

          <div className="search-page__filter-actions">
            <button type="button" onClick={resetFilters}>
              초기화
            </button>
            <button
              type="button"
              className="search-page__apply"
              onClick={() => setShowFilters(false)}
            >
              결과 보기
            </button>
          </div>
        </div>
      )}

      <div className="search-page__result-header">
        <h2>
          검색 결과 <span>{filteredPosts.length}</span>
        </h2>

        <select
          aria-label="게시글 정렬"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortType)}
        >
          <option value="relevance">기본순</option>
          <option value="latest">최신순</option>
          <option value="low">낮은 가격순</option>
          <option value="high">높은 가격순</option>
          <option value="favorite">찜 많은 순</option>
        </select>
      </div>

      <div className="search-page__post-list">
        {filteredPosts.length === 0 ? (
          <div className="search-page__empty">
            <p>검색 결과가 없습니다.</p>
            <span>검색어나 필터 조건을 변경해 보세요.</span>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isPostFavorite = isFavorite(post.id);

            return (
              <article
                className="search-page__post-card"
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
                <Thumbnail src={post.imageUrl} alt={post.title} size={84} radius={10} />

                <div className="search-page__post-info">
                  <h3>{post.title}</h3>

                  <p>
                    {post.seller} · {post.createdAt}
                  </p>

                  <span
                    className={`search-page__status ${
                      post.status === 'SOLD_OUT' ? 'search-page__status--sold' : ''
                    }`}
                  >
                    {post.status === 'ON_SALE' ? '판매 중' : '판매 완료'}
                  </span>

                  <div className="search-page__post-bottom">
                    <strong>{post.price.toLocaleString()}원</strong>

                    <button
                      type="button"
                      className="search-page__favorite"
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
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
