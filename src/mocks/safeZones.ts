import type { SafeZone } from '@/types/safeZone';

export const SAFE_ZONES_MOCK: SafeZone[] = [
  {
    id: 'zone-1',
    name: '제1학생회관 무인 보관소',
    location: '1층 로비',
    operatingHours: '07:00–22:00',
  },
  {
    id: 'zone-2',
    name: '중앙도서관 앞 Safe Zone',
    location: '정문 옆',
    operatingHours: '08:00–21:00',
  },
  {
    id: 'zone-3',
    name: '공학관 B동 로비',
    location: '안내 데스크 옆',
    operatingHours: '09:00–20:00',
  },
  { id: 'zone-4', name: '생활관 정문 Safe Zone', location: '경비실 옆', operatingHours: '24시간' },
];
