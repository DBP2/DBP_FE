import { useEffect, useState } from 'react';

const getRemainingSeconds = (endAt: string, now: number) =>
  Math.max(0, Math.ceil((new Date(endAt).getTime() - now) / 1000));

export function useCountdown(endAt: string) {
  const [now, setNow] = useState(() => Date.now());
  const remainingSeconds = getRemainingSeconds(endAt, now);
  const isRunning = remainingSeconds > 0;

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  return remainingSeconds;
}
