const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const isSameDay = (a: string, b: string) => {
  const first = new Date(a);
  const second = new Date(b);
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export const isSameMinute = (a: string, b: string) =>
  Math.floor(new Date(a).getTime() / 60000) === Math.floor(new Date(b).getTime() / 60000);

export function formatChatDate(value: string): string {
  const date = new Date(value);
  const base = `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
  return date.getFullYear() === new Date().getFullYear() ? base : `${date.getFullYear()}년 ${base}`;
}

export function formatChatTime(value: string): string {
  const date = new Date(value);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}:${minutes}`;
}
