const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export function formatRelativeTime(value: string | Date, now: Date = new Date()): string {
  const date = new Date(value);
  const diff = now.getTime() - date.getTime();

  if (diff < MINUTE) return '방금 전';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;

  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / (24 * HOUR));

  if (dayDiff === 0) return `${Math.floor(diff / HOUR)}시간 전`;
  if (dayDiff === 1) return '어제';
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}
