"use client"
import React, { useState, useEffect } from 'react';
const CurrentTime = () => {
  const [time, setTime] = useState(null);
  const [error, setError] = useState(null);
  const fetchTime = async () => {
    try {
      const response = await fetch('/api/get-time');
      const data = await response.json();
      setTime(data.time);
    } catch (err) {
      setError('Failed to fetch time');
    }
  };
  useEffect(() => {
    fetchTime();
    const interval = setInterval(fetchTime, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex justify-center items-center">
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
        {error ? (
          <div className="text-red-500 font-medium">
            שגיאה: {error}
          </div>
        ) : time ? (
          <div className="text-yellow-400 text-xl font-semibold">
            <span className="ml-2">שעה נוכחית:</span>
            <span className="font-mono">
              {new Date(time).toLocaleString('he-IL', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}
            </span>
          </div>
        ) : (
          <div className="text-gray-400 animate-pulse">
            טוען...
          </div>
        )}
      </div>
    </div>
  );
};
export default CurrentTime;