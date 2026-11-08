import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import heartIcon from '@/assets/images/heart.svg';
import { useFavorites } from '@/hooks/useFavorites';
import { mockPosts } from '@/mocks/posts';

import './PostDetailPage.css';

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const post = mockPosts.find((item) => item.id === Number(postId));

  const [imageIndex, setImageIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  if (!post) {
    return (
      <main className="post-detail-page">
        <div className="post-detail-empty">
          <h2>게시글을 찾을 수 없습니다.</h2>
          <p>삭제되었거나 존재하지 않는 게시글입니다.</p>
          <button type="button" onClick={() => navigate('/')}>
            게시판으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  const images = post.images.slice(0, 10);
  const isSoldOut = post.status === 'SOLD_OUT';
  const isPostFavorite = isFavorite(post.id);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      window.alert('게시글 링크가 복사되었습니다.');
    } catch {
      window.alert('링크를 복사하지 못했습니다.');
    }
  };

  const handlePreviousImage = () => {
    setImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setImageIndex((current) => (current + 1) % images.length);
  };

  const handleChat = () => {
    window.alert('채팅 기능은 추후 연결될 예정입니다.');
  };

  const handleTrade = () => {
    window.alert('거래 신청 기능은 추후 연결될 예정입니다.');
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    window.alert(`${action} 기능은 추후 연결될 예정입니다.`);
  };

  return (
    <main className="post-detail-page">
      <section className="post-detail-image-area">
        <header className="post-detail-header">
          <button
            className="post-detail-icon-button"
            type="button"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="post-detail-header-actions">
            <button
              className="post-detail-icon-button"
              type="button"
              aria-label="공유하기"
              onClick={handleShare}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 16V3M7 8L12 3L17 8M5 13V20H19V13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="post-detail-icon-button"
              type="button"
              aria-label="더보기"
              aria-expanded={showMenu}
              onClick={() => setShowMenu((current) => !current)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="5" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="12" cy="19" r="1.8" />
              </svg>
            </button>
          </div>

          {showMenu && (
            <div className="post-detail-menu">
              <button type="button" onClick={() => handleMenuAction('게시글 수정')}>
                수정하기
              </button>
              <button type="button" onClick={() => handleMenuAction('게시글 삭제')}>
                삭제하기
              </button>
            </div>
          )}
        </header>

        <img
          className="post-detail-main-image"
          src={images[imageIndex] ?? post.imageUrl}
          alt={`${post.title} ${imageIndex + 1}번째 사진`}
        />

        {images.length > 1 && (
          <>
            <button
              className="post-detail-image-arrow post-detail-image-prev"
              type="button"
              aria-label="이전 사진"
              onClick={handlePreviousImage}
            >
              ‹
            </button>

            <button
              className="post-detail-image-arrow post-detail-image-next"
              type="button"
              aria-label="다음 사진"
              onClick={handleNextImage}
            >
              ›
            </button>
          </>
        )}

        <div className="post-detail-image-count">
          {imageIndex + 1} / {images.length || 1}
        </div>
      </section>

      <div className="post-detail-content">
        <section className="post-detail-seller">
          <div className="post-detail-avatar">{post.sellerName.charAt(0)}</div>

          <div className="post-detail-seller-info">
            <div className="post-detail-seller-name">
              <strong>{post.sellerName}</strong>

              {post.sellerVerified && <span className="post-detail-verified">학교 인증</span>}
            </div>

            <p>
              {post.seller} · 거래 {post.sellerTradeCount}회
            </p>
          </div>

          <div className="post-detail-rating">
            <strong>★ {post.sellerRating.toFixed(1)}</strong>
            <span>판매자 평점</span>
          </div>
        </section>

        <section className="post-detail-product">
          <div className="post-detail-tags">
            <span className={isSoldOut ? 'sold-out' : 'on-sale'}>
              {isSoldOut ? '판매완료' : '판매중'}
            </span>
            <span>{post.category}</span>
          </div>

          <h1>{post.title}</h1>

          <strong className="post-detail-price">{post.price.toLocaleString('ko-KR')}원</strong>

          <p className="post-detail-meta">
            {post.createdAt} · 관심 {post.favoriteCount + Number(isPostFavorite)} · 조회{' '}
            {post.viewCount}
          </p>
        </section>

        <section className="post-detail-description-card">
          <h2>상세 설명</h2>
          <p className="post-detail-description">{post.description}</p>
        </section>

        <section className="post-detail-card">
          <h2>거래 조건</h2>

          <div className="post-detail-condition-row">
            <span>카테고리</span>
            <strong>{post.category}</strong>
          </div>

          <div className="post-detail-condition-row">
            <span>물품 상태</span>
            <strong>{post.condition}</strong>
          </div>

          <div className="post-detail-condition-row">
            <span>거래 가능 시간</span>
            <strong>{post.availableTime}</strong>
          </div>

          <div className="post-detail-condition-row">
            <span>선호 거래 장소</span>
            <strong className="post-detail-location">{post.tradeLocation}</strong>
          </div>
        </section>
      </div>

      <footer className="post-detail-bottom">
        <button
          className={`post-detail-favorite ${isPostFavorite ? 'active' : ''}`}
          type="button"
          aria-label={isPostFavorite ? '찜 취소' : '찜하기'}
          aria-pressed={isPostFavorite}
          onClick={() => toggleFavorite(post.id)}
        >
          <img src={heartIcon} alt="" />
        </button>

        <button
          className="post-detail-chat"
          type="button"
          onClick={handleChat}
          disabled={isSoldOut}
        >
          채팅하기
        </button>

        <button
          className="post-detail-trade"
          type="button"
          onClick={handleTrade}
          disabled={isSoldOut}
        >
          {isSoldOut ? '판매 완료' : '거래 신청'}
        </button>
      </footer>
    </main>
  );
}
