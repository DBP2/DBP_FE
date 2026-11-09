
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import heartIcon from '@/assets/images/heart.svg';
import editIcon from '@/assets/images/edit.svg';
import tradeStatusIcon from '@/assets/images/trade-status.svg';
import trashIcon from '@/assets/images/trash.svg';
import { useFavorites } from '@/hooks/useFavorites';
import { mockPosts } from '@/mocks/posts';
import { getPostEditPath, getChatRoomPath } from '@/router/routes';

import './PostDetailPage.css';

type SavedPost = {
	title: string;
	category: string;
	subject: string;
	description: string;
	price: string;
	condition: string;
	tradeMethods: string[];
	availableTime: string;
	images: string[];
};

type DetailPost = {
	id: number;
	title: string;
	price: number;
	seller: string;
	createdAt: string;
	imageUrl: string;
	favoriteCount: number;
	status: 'ON_SALE' | 'SOLD_OUT';
	sellerId: string;
	sellerName: string;
	sellerVerified: boolean;
	sellerRating: number;
	sellerTradeCount: number;
	description: string;
	category: string;
	condition: string;
	availableTime: string;
	tradeLocation: string;
	viewCount: number;
	images: string[];
};

const STORAGE_KEY = 'campus-posts';
const DELETED_KEY = 'campus-deleted-posts';

const readSavedPost = (postId: string): SavedPost | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);

		if (!stored) return null;

		const posts = JSON.parse(stored) as Record<string, SavedPost>;

		return posts[postId] ?? null;
	} catch {
		return null;
	}
};

const readDeletedPosts = (): string[] => {
	try {
		const stored = localStorage.getItem(DELETED_KEY);
		const parsed: unknown = stored ? JSON.parse(stored) : [];

		return Array.isArray(parsed)
			? parsed.filter((id): id is string => typeof id === 'string')
			: [];
	} catch {
		return [];
	}
};

const getTradeLocation = (methods: string[]) => {
	return methods
		.map((method) => {
			if (method === 'SAFE_ZONE') return 'Safe Zone';
			if (method === 'DIRECT') return '교내 직거래';
			return '';
		})
		.filter(Boolean)
		.join(', ');
};

export default function PostDetailPage() {
	const navigate = useNavigate();
	const { postId } = useParams();

	const isDeleted = postId
		? readDeletedPosts().includes(postId)
		: false;

	const mockPost = mockPosts.find(
		(item) => item.id === Number(postId),
	);

	const savedPost = postId ? readSavedPost(postId) : null;

	let post: DetailPost | null = null;

	if (!isDeleted && mockPost) {
		post = {
			...mockPost,
			title: savedPost?.title ?? mockPost.title,
			price: savedPost ? Number(savedPost.price) : mockPost.price,
			description: savedPost?.description ?? mockPost.description,
			category: savedPost
				? `${savedPost.category} · ${savedPost.subject}`
				: mockPost.category,
			condition: savedPost?.condition ?? mockPost.condition,
			availableTime:
				savedPost?.availableTime ?? mockPost.availableTime,
			tradeLocation: savedPost
				? getTradeLocation(savedPost.tradeMethods ?? [])
				: mockPost.tradeLocation,
			images: savedPost?.images ?? mockPost.images,
			imageUrl: savedPost?.images?.[0] ?? mockPost.imageUrl,
		};
	} else if (!isDeleted && savedPost && postId) {
		post = {
			id: Number(postId),
			title: savedPost.title,
			price: Number(savedPost.price),
			seller: '판매자',
			createdAt: '방금 전',
			imageUrl: savedPost.images[0] ?? '',
			favoriteCount: 0,
			status: 'ON_SALE',
			sellerId: 'current-user',
			sellerName: '나',
			sellerVerified: false,
			sellerRating: 0,
			sellerTradeCount: 0,
			description: savedPost.description,
			category: `${savedPost.category} · ${savedPost.subject}`,
			condition: savedPost.condition,
			availableTime: savedPost.availableTime,
			tradeLocation: getTradeLocation(savedPost.tradeMethods ?? []),
			viewCount: 0,
			images: savedPost.images,
		};
	}

	const [imageIndex, setImageIndex] = useState(0);
	const [showMenu, setShowMenu] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

	const currentImageIndex = Math.min(
		imageIndex,
		Math.max(images.length - 1, 0),
	);

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			window.alert('게시글 링크가 복사되었습니다.');
		} catch {
			window.alert('링크를 복사하지 못했습니다.');
		}
	};

	const handlePreviousImage = () => {
		if (images.length === 0) return;

		setImageIndex(
			(current) => (current - 1 + images.length) % images.length,
		);
	};

	const handleNextImage = () => {
		if (images.length === 0) return;

		setImageIndex((current) => (current + 1) % images.length);
	};

	const handleChat = () => {
		navigate(getChatRoomPath('1'));
	};

	const handleTrade = () => {
		window.alert('거래 신청 기능은 추후 연결될 예정입니다.');
	};

	const handleEdit = () => {
		setShowMenu(false);

		if (postId) {
			navigate(getPostEditPath(postId));
		}
	};

	const handleDelete = () => {
		if (!postId) return;

		try {
			const stored = localStorage.getItem(STORAGE_KEY);

			if (stored) {
				const posts = JSON.parse(stored) as Record<string, SavedPost>;

				delete posts[postId];

				localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
			}

			const deletedPosts = readDeletedPosts();

			if (!deletedPosts.includes(postId)) {
				deletedPosts.push(postId);
			}

			localStorage.setItem(
				DELETED_KEY,
				JSON.stringify(deletedPosts),
			);

			setShowDeleteConfirm(false);
			setShowMenu(false);
			window.alert('게시글이 삭제되었습니다.');
			navigate('/', { replace: true });
		} catch {
			window.alert('게시글 삭제에 실패했습니다.');
		}
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
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<circle cx="12" cy="5" r="1.8" />
								<circle cx="12" cy="12" r="1.8" />
								<circle cx="12" cy="19" r="1.8" />
							</svg>
						</button>
					</div>
				</header>

				<img
					className="post-detail-main-image"
					src={images[currentImageIndex] ?? post.imageUrl}
					alt={`${post.title} ${currentImageIndex + 1}번째 사진`}
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
					{currentImageIndex + 1} / {images.length || 1}
				</div>
			</section>

			<div className="post-detail-content">
				<section className="post-detail-seller">
					<div className="post-detail-avatar">
						{post.sellerName.charAt(0)}
					</div>

					<div className="post-detail-seller-info">
						<div className="post-detail-seller-name">
							<strong>{post.sellerName}</strong>

							{post.sellerVerified && (
								<span className="post-detail-verified">
									학교 인증
								</span>
							)}
						</div>

						<p>
							{post.seller} · 거래 {post.sellerTradeCount}회
						</p>
					</div>

					<div className="post-detail-rating">
						<strong>
							★ {post.sellerRating.toFixed(1)}
						</strong>
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

					<strong className="post-detail-price">
						{post.price.toLocaleString('ko-KR')}원
					</strong>

					<p className="post-detail-meta">
						{post.createdAt} · 관심{' '}
						{post.favoriteCount + Number(isPostFavorite)}
						{' '}· 조회 {post.viewCount}
					</p>
				</section>

				<section className="post-detail-description-card">
					<h2>상세 설명</h2>
					<p className="post-detail-description">
						{post.description}
					</p>
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
						<strong className="post-detail-location">
							{post.tradeLocation}
						</strong>
					</div>
				</section>
			</div>

			{showMenu && (
				<div className="post-detail-sheet-layer">
					<button
						type="button"
						className="post-detail-sheet-backdrop"
						aria-label="메뉴 닫기"
						onClick={() => {
							if (!showDeleteConfirm) setShowMenu(false);
						}}
					/>
					<div
						className="post-detail-sheet"
						role="dialog"
						aria-label="게시글 관리 메뉴"
					>
						<div className="post-detail-sheet-handle" />

						<button
							type="button"
							className="post-detail-sheet-item"
							onClick={handleEdit}
						>
							<img src={editIcon} alt="" />
							<span>게시글 수정</span>
						</button>

						<button
							type="button"
							className="post-detail-sheet-item"
							onClick={() =>
								window.alert(
									'거래 상태 변경 기능은 추후 연결될 예정입니다.',
								)
							}
						>
							<img src={tradeStatusIcon} alt="" />
							<span>
								거래 상태 변경{' '}
								<small>(예약중 · 거래완료)</small>
							</span>
						</button>

						<button
							type="button"
							className="post-detail-sheet-item post-detail-sheet-item-danger"
							onClick={() => setShowDeleteConfirm(true)}
						>
							<img src={trashIcon} alt="" />
							<span>게시글 삭제</span>
						</button>
					</div>
				</div>
			)}

			{showDeleteConfirm && (
				<div className="post-detail-confirm-layer">
					<div
						className="post-detail-confirm"
						role="alertdialog"
						aria-modal="true"
						aria-labelledby="post-delete-title"
						aria-describedby="post-delete-description"
					>
						<div className="post-detail-confirm-icon">
							<img src={trashIcon} alt="" />
						</div>

						<h2 id="post-delete-title">
							게시글을 삭제할까요?
						</h2>

						<p id="post-delete-description">
							삭제한 게시글은 복구할 수 없어요.
						</p>

						<div className="post-detail-confirm-actions">
							<button
								type="button"
								onClick={() => setShowDeleteConfirm(false)}
							>
								취소
							</button>
							<button
								type="button"
								className="post-detail-confirm-delete"
								onClick={handleDelete}
							>
								삭제
							</button>
						</div>
					</div>
				</div>
			)}

			<footer className="post-detail-bottom">
				<button
					className={`post-detail-favorite ${
						isPostFavorite ? 'active' : ''
					}`}
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
