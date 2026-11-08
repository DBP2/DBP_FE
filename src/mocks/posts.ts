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
    sellerId: 'user-2',
    sellerName: '김지훈',
    sellerVerified: true,
    sellerRating: 4.8,
    sellerTradeCount: 23,
    description:
      '경제학원론 7판 교재입니다.\n필기 거의 없고 깨끗하게 사용했습니다.\n필요하신 분 편하게 연락 주세요!',
    category: '교재 · 경제원론',
    condition: '상',
    availableTime: '평일 오후 2시 ~ 6시',
    tradeLocation: '중앙도서관 앞 Safe Zone',
    viewCount: 86,
    images: [economicsImage],
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
    sellerId: 'user-3',
    sellerName: '이서연',
    sellerVerified: true,
    sellerRating: 4.9,
    sellerTradeCount: 15,
    description: '회계원리 교재 세트 판매합니다.\n전체적으로 상태 좋고 필기 거의 없습니다.',
    category: '교재 · 회계원리',
    condition: '상',
    availableTime: '평일 오후 1시 ~ 5시',
    tradeLocation: '학생회관 앞 Safe Zone',
    viewCount: 42,
    images: [accountingImage],
  },
];
