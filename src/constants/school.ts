export const SCHOOL_NAME = '동덕여대';

export const SCHOOL_EMAIL_DOMAINS = [
  'snu.ac.kr',
  'korea.ac.kr',
  'hanyang.ac.kr',
  'kookmin.ac.kr',
  'dongduk.ac.kr',
] as const;

export type SchoolEmailDomain = (typeof SCHOOL_EMAIL_DOMAINS)[number];

export const DEFAULT_SCHOOL_EMAIL_DOMAIN: SchoolEmailDomain = 'dongduk.ac.kr';

export const isSchoolEmailDomain = (value: string): value is SchoolEmailDomain =>
  (SCHOOL_EMAIL_DOMAINS as readonly string[]).includes(value);

export const DEPARTMENTS = [
  '국어국문학과',
  '영어영문학과',
  '문헌정보학과',
  '사회복지학과',
  '아동학과',
  '경영학과',
  '경제학과',
  '회계학과',
  '국제경영학과',
  '컴퓨터학과',
  '정보통계학과',
  '식품영양학과',
  '보건관리학과',
  '응용화학과',
  '화장품학과',
  '약학과',
  '체육학과',
  '디지털공예과',
  '큐레이터학과',
  '미디어디자인학과',
] as const;
