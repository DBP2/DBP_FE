import { useState } from 'react';
import { useNavigate } from 'react-router';

import safeZoneInfoImage from '@/assets/images/safeZone_info.svg';
import BottomBar from '@/components/common/BottomBar/BottomBar';
import Button from '@/components/common/Button/Button';
import ErrorState from '@/components/common/ErrorState/ErrorState';
import OptionCard from '@/components/common/OptionCard/OptionCard';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import TextArea from '@/components/common/TextArea/TextArea';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useSafeZones } from '@/hooks/useSafeZones';
import { ROUTES } from '@/router/routes';
import { usePostDraftStore } from '@/store/postDraftStore';

import './PostSafeZonePage.css';

const MESSAGE_MAX_LENGTH = 200;

export default function PostSafeZonePage() {
  const navigate = useNavigate();
  const draft = usePostDraftStore((state) => state.draft);
  const clearDraft = usePostDraftStore((state) => state.clearDraft);
  const { data: safeZones = [], isPending, isError, refetch } = useSafeZones();
  const createPost = useCreatePost();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSafeZone = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!draft) {
      setErrorMessage('작성 중인 게시글 정보가 없어요. 게시글 작성부터 다시 진행해 주세요.');
      return;
    }
    try {
      await createPost.mutateAsync({
        ...draft,
        safeZoneIds: selectedIds,
        messageToBuyer: message.trim(),
      });
      clearDraft();
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      setErrorMessage('판매 등록에 실패했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <section className="post-safe-zone-page">
      <PageHeader className="post-safe-zone-page__header" title="Safe Zone 선택" />
      <div className="post-safe-zone-page__body">
        <div className="post-safe-zone-page__intro">
          <div className="post-safe-zone-page__image-frame">
            <img
              className="post-safe-zone-page__image"
              src={safeZoneInfoImage}
              alt="Safe Zone 보관함에 물품을 두고 QR로 기록하는 과정"
              width={318}
              height={190}
            />
          </div>
          <h2 className="post-safe-zone-page__intro-title">거래할 Safe Zone을 선택하세요</h2>
          <p className="post-safe-zone-page__intro-text">
            선택한 장소에서 QR을 스캔하고 두고가기·가져가기로 구매자와 만나지 않고 거래해요.
          </p>
        </div>

        <div className="post-safe-zone-page__field">
          <h3 className="post-safe-zone-page__label">
            거래 장소 <span className="post-safe-zone-page__label-sub">(중복 선택 가능)</span>
          </h3>
          {isError ? (
            <ErrorState message="장소 목록을 불러오지 못했어요" onRetry={() => void refetch()} />
          ) : (
            <ul className="post-safe-zone-page__zones">
              {safeZones.map((zone) => (
                <li key={zone.id}>
                  <OptionCard
                    title={zone.name}
                    description={`${zone.location} · ${zone.operatingHours}`}
                    checked={selectedIds.includes(zone.id)}
                    onChange={() => toggleSafeZone(zone.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="post-safe-zone-page__field">
          <h3 className="post-safe-zone-page__label">
            구매자에게 한마디 <span className="post-safe-zone-page__label-sub">(선택)</span>
          </h3>
          <TextArea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="예) 평일 오후에 Safe Zone에 두고 갈게요!"
            rows={3}
          />
          <p className="post-safe-zone-page__note">
            <span>※</span>
            <span>
              Safe Zone은 학내에 부착된 QR 기반으로 운영돼요.
              <br />
              GPS 위치는 확인하지 않아요.
            </span>
          </p>
        </div>
      </div>

      <BottomBar errorMessage={errorMessage}>
        <Button
          fullWidth
          disabled={isPending || selectedIds.length === 0 || createPost.isPending}
          onClick={() => void handleSubmit()}
        >
          {selectedIds.length > 0 ? `판매 등록하기 (${selectedIds.length}곳)` : '판매 등록하기'}
        </Button>
      </BottomBar>
    </section>
  );
}
