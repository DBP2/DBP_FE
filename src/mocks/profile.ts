import type { MyProfile } from '@/types/profile';

export const MY_PROFILE_MOCK: MyProfile = {
  trustGrade: 'B',
  rating: 4.5,
  hasSanction: false,
  nextGrade: 'A',
  tradesToNextGrade: 3,
  gradeProgress: 0.72,
  completedTradeCount: 12,
  reviewCount: 9,
  onTimeReturnRate: 100,
  reviewKeywords: [
    { label: '설명과 상태가 같아요', count: 7 },
    { label: '응답이 빨라요', count: 5 },
    { label: '친절해요', count: 4 },
  ],
  postCount: 4,
  wishCount: 5,
};
