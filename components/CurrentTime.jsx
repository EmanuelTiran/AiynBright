"use client"
import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTime = async () => {
        try {
          const response = await fetch('https://cors-anywhere.herokuapp.com/https://timeapi.io/api/Time/current/zone?timeZone=Israel');
          const data = await response.json();
          setTime(data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching time: ' + error.message);
          setLoading(false);
        }
      };

    fetchTime();
    const intervalId = setInterval(fetchTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Current Time in Israel</h2>
        {time && (
          <div className="text-center">
            <p className="text-xl text-gray-700">Date: {time.date}</p>
            <p className="text-3xl font-semibold text-gray-900">{time.time}</p>
            <p className="text-lg text-gray-600">Day of Week: {time.dayOfWeek}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentTime;