"use client";

import { useEffect, useState } from "react";

function TimeCard({ children }) {
  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg bg-slate-800 p-4 shadow-lg">
        <div className="text-xl font-semibold text-yellow-400">
          <span className="ml-2">
            שעה נוכחית:
          </span>

          <span className="font-mono">
            {children}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CurrentTime() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const updateTime = () =>
      setTime(new Date());

    const initialTimer =
      window.setTimeout(updateTime, 0);

    const interval =
      window.setInterval(updateTime, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  if (!time) {
    return <TimeCard>--:--:--</TimeCard>;
  }

  return (
    <TimeCard>
      {time.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })}
    </TimeCard>
  );
}