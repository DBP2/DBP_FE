
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { mockPosts } from '@/mocks/posts';
import { useCreatePost } from '@/hooks/useCreatePost';
import { usePostDraftStore } from '@/store/postDraftStore';
import { ROUTES, getPostDetailPath } from '@/router/routes';
import type {
	PostDraft,
	TradeMethod,
	ItemCondition,
} from '@/types/post';
import BottomBar from '@/components/common/BottomBar/BottomBar';
import './PostFormPage.css';

const MAX_IMAGES = 10;
const STORAGE_KEY = 'campus-posts';

interface SavedPost {
	title: string;
	category: string;
	subject: string;
	description: string;
	price: string;
	condition: string;
	tradeMethods: string[];
	availableTime: string;
	images: string[];
}

interface FormState {
	title: string;
	category: string;
	courseName: string;
	description: string;
	price: string;
	condition: ItemCondition;
	tradeMethods: TradeMethod[];
	availableTime: string;
}

const initialForm: FormState = {
	title: '',
	category: '',
	courseName: '',
	description: '',
	price: '',
	condition: 'HIGH',
	tradeMethods: [],
	availableTime: '',
};

function readSavedPosts(): Record<string, SavedPost> {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value ? JSON.parse(value) : {};
	} catch {
		return {};
	}
}

function normalizeCondition(value: string): ItemCondition {
	if (value === '중' || value === 'MEDIUM') return 'MEDIUM';
	if (value === '하' || value === 'LOW') return 'LOW';
	return 'HIGH';
}

function toSavedCondition(value: ItemCondition): string {
	if (value === 'MEDIUM') return '중';
	if (value === 'LOW') return '하';
	return '상';
}

function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'));

		reader.readAsDataURL(file);
	});
}

async function urlToFile(url: string, index: number): Promise<File> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error('기존 이미지를 불러오지 못했습니다.');
	}

	const blob = await response.blob();
	const extension = blob.type === 'image/svg+xml'
		? 'svg'
		: blob.type.split('/')[1] || 'png';

	return new File(
		[blob],
		`post-image-${index}.${extension}`,
		{ type: blob.type || 'image/png' },
	);
}

export default function PostFormPage() {
	const navigate = useNavigate();
	const { postId } = useParams<{ postId: string }>();
	const isEditing = Boolean(postId);

	const createPost = useCreatePost();
	const setDraft = usePostDraftStore((state) => state.setDraft);

	const [form, setForm] = useState<FormState>(initialForm);
	const [images, setImages] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [loading, setLoading] = useState(isEditing);
	const [saving, setSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (!postId) return;

		let cancelled = false;

		async function loadPost() {
			try {
				const saved = readSavedPosts()[postId!];

				if (saved) {
					const loadedImages = await Promise.all(
						(saved.images || [])
							.slice(0, MAX_IMAGES)
							.map(urlToFile),
					);

					if (cancelled) return;

					setForm({
						title: saved.title || '',
						category: saved.category || '',
						courseName: saved.subject || '',
						description: saved.description || '',
						price: saved.price || '',
						condition: normalizeCondition(saved.condition),
						tradeMethods: (saved.tradeMethods || []).filter(
							(method): method is TradeMethod =>
								method === 'SAFE_ZONE' || method === 'DIRECT',
						),
						availableTime: saved.availableTime || '',
					});

					setImages(loadedImages);
					return;
				}

				const mock = mockPosts.find(
					(post) => String(post.id) === postId,
				);

				if (!mock) {
					throw new Error('게시글을 찾을 수 없습니다.');
				}

				const loadedImages = await Promise.all(
					mock.images.slice(0, MAX_IMAGES).map(urlToFile),
				);

				if (cancelled) return;

				const categoryParts = mock.category.split(' · ');

				setForm({
					title: mock.title,
					category: categoryParts[0] || '교재',
					courseName: categoryParts.slice(1).join(' · '),
					description: mock.description,
					price: String(mock.price),
					condition: normalizeCondition(mock.condition),
					tradeMethods: mock.tradeLocation.includes('Safe Zone')
						? ['SAFE_ZONE']
						: ['DIRECT'],
					availableTime: mock.availableTime,
				});

				setImages(loadedImages);
			} catch (error) {
				if (!cancelled) {
					setErrorMessage(
						error instanceof Error
							? error.message
							: '게시글을 불러오지 못했습니다.',
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		void loadPost();

		return () => {
			cancelled = true;
		};
	}, [postId]);

    useEffect(() => {
        const urls = images.map((file) => URL.createObjectURL(file));

        queueMicrotask(() => {
            setPreviews(urls);
        });

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

	function updateField<K extends keyof FormState>(
		key: K,
		value: FormState[K],
	) {
		setForm((previous) => ({
			...previous,
			[key]: value,
		}));
		setErrorMessage('');
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const selected = Array.from(event.target.files || []);
		const remaining = MAX_IMAGES - images.length;

		if (selected.length > remaining) {
			setErrorMessage(`사진은 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.`);
		}

		const accepted = selected
			.filter((file) => file.type.startsWith('image/'))
			.slice(0, remaining);

		setImages((previous) => [...previous, ...accepted]);
		event.target.value = '';
	}

	function removeImage(index: number) {
		setImages((previous) =>
			previous.filter((_, imageIndex) => imageIndex !== index),
		);
		setErrorMessage('');
	}

	function toggleTradeMethod(method: TradeMethod) {
		setForm((previous) => ({
			...previous,
			tradeMethods: previous.tradeMethods.includes(method)
				? previous.tradeMethods.filter((value) => value !== method)
				: [...previous.tradeMethods, method],
		}));
		setErrorMessage('');
	}

	function validate(): string {
		if (images.length < 1) return '사진을 최소 1장 등록해 주세요.';
		if (images.length > MAX_IMAGES) {
			return `사진은 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.`;
		}
		if (!form.title.trim()) return '게시글 제목을 입력해 주세요.';
		if (!form.category.trim()) return '카테고리를 선택해 주세요.';
		if (!form.courseName.trim()) return '과목명을 입력해 주세요.';
		if (!form.description.trim()) return '상품 설명을 입력해 주세요.';
		if (!form.price.trim() || Number(form.price) <= 0) {
			return '올바른 가격을 입력해 주세요.';
		}
		if (form.tradeMethods.length === 0) {
			return '거래 방식을 선택해 주세요.';
		}
		if (!form.availableTime.trim()) {
			return '거래 가능 시간을 입력해 주세요.';
		}
		return '';
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const validationError = validate();

		if (validationError) {
			setErrorMessage(validationError);
			return;
		}

		const draft: PostDraft = {
			images,
			title: form.title.trim(),
			category: form.category,
			courseName: form.courseName.trim(),
			description: form.description.trim(),
			price: Number(form.price),
			condition: form.condition,
			tradeMethods: form.tradeMethods,
			availableTime: form.availableTime.trim(),
		};

		setSaving(true);
		setErrorMessage('');

		try {
			if (isEditing && postId) {
				const imageData = await Promise.all(
					images.map(fileToDataUrl),
				);

				const posts = readSavedPosts();

				posts[postId] = {
					title: draft.title,
					category: draft.category,
					subject: draft.courseName,
					description: draft.description,
					price: String(draft.price),
					condition: toSavedCondition(draft.condition),
					tradeMethods: draft.tradeMethods,
					availableTime: draft.availableTime,
					images: imageData,
				};

				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify(posts),
				);

				navigate(getPostDetailPath(postId), {
					replace: true,
				});
				return;
			}

			if (draft.tradeMethods.includes('SAFE_ZONE')) {
				setDraft(draft);
				navigate(ROUTES.POST_SAFE_ZONE);
				return;
			}

			const response = await createPost.mutateAsync({
				...draft,
				safeZoneIds: [],
				messageToBuyer: '',
			});

			const imageData = await Promise.all(
				images.map(fileToDataUrl),
			);

			const posts = readSavedPosts();

			posts[response.id] = {
				title: draft.title,
				category: draft.category,
				subject: draft.courseName,
				description: draft.description,
				price: String(draft.price),
				condition: toSavedCondition(draft.condition),
				tradeMethods: draft.tradeMethods,
				availableTime: draft.availableTime,
				images: imageData,
			};

			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(posts),
			);

			navigate(getPostDetailPath(response.id), {
				replace: true,
			});
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: '게시글 저장 중 오류가 발생했습니다.',
			);
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return <div className="post-form-page">게시글을 불러오는 중...</div>;
	}

	return (
		<form className="post-form-page" onSubmit={handleSubmit}>
			<header className="post-form-header">
				<button
					type="button"
					onClick={() => navigate(-1)}
				>
					취소
				</button>
				<h1>{isEditing ? '게시글 수정' : '판매글 작성'}</h1>
			</header>

			<section className="post-form-section">
				<h2>상품 사진</h2>
				<p>첫 번째 사진이 대표 사진으로 표시됩니다.</p>

				<div className="post-form-images">
					{images.length < MAX_IMAGES && (
						<label className="post-form-image-add">
							<span>사진 추가</span>
							<span>{images.length}/{MAX_IMAGES}</span>
							<input
								type="file"
								accept="image/*"
								multiple
								onChange={handleImageChange}
								style={{ display: 'none' }}
							/>
						</label>
					)}

					{previews.map((url, index) => (
						<div
							className="post-form-image-item"
							key={url}
						>
							<img
								src={url}
								alt={`상품 사진 ${index + 1}`}
							/>
							{index === 0 && (
								<span className="post-form-cover">
									대표
								</span>
							)}
							<button
								type="button"
								onClick={() => removeImage(index)}
								aria-label={`사진 ${index + 1} 삭제`}
							>
								×
							</button>
						</div>
					))}
				</div>
			</section>

			<section className="post-form-section">
				<h2>상품 정보</h2>

				<label htmlFor="post-title">제목</label>
				<input
					id="post-title"
					value={form.title}
					onChange={(event) =>
						updateField('title', event.target.value)
					}
					placeholder="판매할 교재의 제목을 입력해 주세요."
					maxLength={100}
				/>

				<label htmlFor="post-category">카테고리</label>
				<select
					id="post-category"
					value={form.category}
					onChange={(event) =>
						updateField('category', event.target.value)
					}
				>
					<option value="">카테고리 선택</option>
					<option value="교재">교재</option>
					<option value="전공 교재">전공 교재</option>
					<option value="교양 교재">교양 교재</option>
				</select>

				<label htmlFor="post-course">과목명</label>
				<input
					id="post-course"
					value={form.courseName}
					onChange={(event) =>
						updateField('courseName', event.target.value)
					}
					placeholder="과목명을 입력해 주세요."
				/>

				<label htmlFor="post-description">상품 설명</label>
				<textarea
					id="post-description"
					value={form.description}
					onChange={(event) =>
						updateField('description', event.target.value)
					}
					placeholder="교재 상태와 판매 정보를 입력해 주세요."
					rows={5}
				/>

				<label htmlFor="post-price">판매 가격</label>
				<input
					id="post-price"
					type="number"
					min="1"
					value={form.price}
					onChange={(event) =>
						updateField('price', event.target.value)
					}
					placeholder="가격을 입력해 주세요."
				/>
			</section>

			<section className="post-form-section">
				<h2>상품 상태</h2>

				<div className="post-form-condition-options">
					{([
						['HIGH', '상'],
						['MEDIUM', '중'],
						['LOW', '하'],
					] as const).map(([value, label]) => (
						<label key={value}>
							<input
								type="radio"
								name="condition"
								value={value}
								checked={form.condition === value}
								onChange={() =>
									updateField('condition', value)
								}
							/>
							{label}
						</label>
					))}
				</div>
			</section>

			<section className="post-form-section">
				<h2>거래 방식</h2>
				<p>거래 방식은 중복 선택할 수 있습니다.</p>

				<div className="post-form-trade-options">
					<label>
						<input
							type="checkbox"
							checked={form.tradeMethods.includes('SAFE_ZONE')}
							onChange={() => toggleTradeMethod('SAFE_ZONE')}
						/>
						Safe Zone
					</label>

					<label>
						<input
							type="checkbox"
							checked={form.tradeMethods.includes('DIRECT')}
							onChange={() => toggleTradeMethod('DIRECT')}
						/>
						교내 직거래
					</label>
				</div>

				<label htmlFor="post-available-time">
					거래 가능 시간
				</label>
				<input
					id="post-available-time"
					value={form.availableTime}
					onChange={(event) =>
						updateField('availableTime', event.target.value)
					}
					placeholder="예: 평일 오후 2시 ~ 6시"
				/>
			</section>

			<BottomBar errorMessage={errorMessage}>
				<button
					type="submit"
					disabled={saving || createPost.isPending}
					className="post-form-submit"
				>
					{saving || createPost.isPending
						? '저장 중...'
						: isEditing
							? '수정 완료'
							: '다음'}
				</button>
			</BottomBar>
		</form>
	);
}