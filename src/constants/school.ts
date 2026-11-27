export const SCHOOL_OPTIONS = [
  '서울대학교',
  '고려대학교',
  '한양대학교',
  '국민대학교',
  '동덕여자대학교',
] as const;

export const CUSTOM_SCHOOL_OPTION = '직접 입력';

export const normalizeSchoolName = (name: string) => name.replace(/\s/g, '');
