"use client"
import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // עדכון כל שנייה
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // ניקוי ה-interval כשהקומפוננטה מתפרקת
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
        <div className="text-yellow-400 text-xl font-semibold">
          <span className="ml-2">שעה נוכחית:</span>
          <span className="font-mono">
            {time.toLocaleString('he-IL', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentTime;