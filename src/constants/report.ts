import type { ReportType } from '@/types/report';

export const REPORT_REASON_MIN_LENGTH = 10;

export const REPORT_REASON_MAX_LENGTH = 500;

export interface ReportTypeOption {
  value: ReportType;
  label: string;
  description: string;
  // 제재 매뉴얼에 따른 자동 분류 결과 안내
  sanction: string;
}

export const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  {
    value: 'FRAUD',
    label: '사기',
    description: '잠적, 외부 사이트 유도, 허위 매물',
    sanction: '중대 사안으로 분류 → 계정 정지 및 변상 처리',
  },
  {
    value: 'MANNER',
    label: '기타 (비매너)',
    description: '연락두절, 일방적 취소 누적, 악의적 리뷰',
    sanction: '경미 사안으로 분류 → 경고 후 누적 시 이용 제한',
  },
];
