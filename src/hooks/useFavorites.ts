import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'favoritePostIds';

let favoriteIds: number[] = [];

const listeners = new Set<() => void>();

const readFavorites = (): number[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is number => typeof id === 'number' && Number.isInteger(id));
  } catch {
    return [];
  }
};

if (typeof window !== 'undefined') {
  favoriteIds = readFavorites();

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;

    favoriteIds = readFavorites();
    listeners.forEach((listener) => listener());
  });
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => favoriteIds;

const getServerSnapshot = () => [] as number[];

const toggleFavorite = (postId: number) => {
  favoriteIds = favoriteIds.includes(postId)
    ? favoriteIds.filter((id) => id !== postId)
    : [...favoriteIds, postId];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch (error) {
    console.error('찜 목록 저장 실패:', error);
  }

  listeners.forEach((listener) => listener());
};

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    favorites,
    isFavorite: (postId: number) => favorites.includes(postId),
    toggleFavorite,
  };
}
