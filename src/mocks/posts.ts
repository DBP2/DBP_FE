import economicsImage from '@/assets/images/economics.svg';
import accountingImage from '@/assets/images/accounting.svg';

export interface MockPost {
  id: number;
  title: string;
  price: number;
  seller: string;
  createdAt: string;
  imageUrl: string;
  favoriteCount: number;
  status: 'ON_SALE' | 'SOLD_OUT';
}

export const mockPosts: MockPost[] = [
  {
    id: 1,
    title: '경제학원론 7판 (맨큐) 필기 거의 없음',
    price: 15000,
    seller: '경영학과',
    createdAt: '3분 전',
    imageUrl: economicsImage,
    favoriteCount: 12,
    status: 'ON_SALE',
  },
  {
    id: 2,
    title: '회계원리 교재 세트',
    price: 20000,
    seller: '경영학과',
    createdAt: '20분 전',
    imageUrl: accountingImage,
    favoriteCount: 8,
    status: 'ON_SALE',
  },
];
