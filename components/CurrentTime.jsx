"use client"
import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // אם הקומפוננטה עוד לא מותקנת, נחזיר div ריק כדי למנוע הבדלים בין השרת ללקוח
  if (!mounted) {
    return <div className="flex justify-center items-center">
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
        <div className="text-yellow-400 text-xl font-semibold">
          <span className="ml-2">שעה נוכחית:</span>
          <span className="font-mono">--:--:--</span>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
        <div className="text-yellow-400 text-xl font-semibold">
          <span className="ml-2">שעה נוכחית:</span>
          <span className="font-mono">
            {time?.toLocaleString('he-IL', {
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