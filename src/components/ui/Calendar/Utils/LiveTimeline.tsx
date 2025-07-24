// components/ui/Calendar/WeeklyView/LiveTimeline.tsx
import { useEffect, useState } from "react";

interface LiveTimelineProps {
  day: Date;
  hour: number; // iterowany indeks godziny
}

export default function LiveTimeline({ day, hour }: LiveTimelineProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000); // co minutę

    return () => clearInterval(interval);
  }, []);

  const isToday = now.toDateString() === day.toDateString();
  const isCurrentHour = now.getHours() === hour;

  if (!isToday || !isCurrentHour) return null;

  const minutes = now.getMinutes();
  const top = (minutes / 60) * 64;

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}px`,
        left: 0,
        right: 0,
        height: "2px",
        background: "#ef4444", // red-500
        zIndex: 998,
      }}
    />
  );
}
