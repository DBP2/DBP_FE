const pad = (value: number) => String(value).padStart(2, '0');

export function formatTime24(value: string | Date): string {
  const date = new Date(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatMonthDayTime(value: string | Date): string {
  const date = new Date(value);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${formatTime24(date)}`;
}
