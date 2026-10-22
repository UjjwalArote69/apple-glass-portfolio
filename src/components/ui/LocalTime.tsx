import { useEffect, useState } from 'react';

const mumbaiTime = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata',
});

/** Live Mumbai (IST) wall-clock time, refreshed every 15 seconds. */
export function LocalTime() {
  const [time, setTime] = useState(() => mumbaiTime.format(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setTime(mumbaiTime.format(new Date())), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <time>{time}</time>;
}
