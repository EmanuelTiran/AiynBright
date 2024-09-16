"use client"
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import Popup from '../Popup';

export default function Field({ user, distanceUser }) {
  const words = ["9", "5", "7", "1", "8", "2", "4", "6", "0", "1", "A", "S", "d", "F", "E", "X", "V", "G", "I", "M", "N", "B", "Z", "W"];
  const sizes = [-24, -20, -15, -10, 0, 10, 15, 15, 24]; // ערכים בס"מ למיקום
  const [open, setOpen] = useState(false);
  const [isLeft, setIsLeft] = useState(distanceUser?.side === 'left' ? true : false);
  const [distance, setDistance] = useState(distanceUser ? distanceUser.distance : 0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSizeIndex, setCurrentSizeIndex] = useState(4);

  useEffect(() => {
    setDistance(sizes[currentSizeIndex]);
  }, [currentSizeIndex]);

  const moveRight = () => {
    if (currentSizeIndex < sizes.length - 1) setCurrentSizeIndex(currentSizeIndex + 1);
    setDistance(sizes[currentSizeIndex])
  };

  const moveLeft = () => {
    if (currentSizeIndex > 0) setCurrentSizeIndex(currentSizeIndex - 1);
    setDistance(sizes[currentSizeIndex])
  };

  const overWord = () => {
    setCurrentWordIndex((currentWordIndex - 1 + words.length) % words.length); // מחזור מילים
  };

  const handleMistake = async () => {
    let taut = { side: isLeft ? 'left' : 'right', distance: sizes[currentSizeIndex] };

    user.fieldWeaknesses.push(taut);
    // שליחת הבקשה ל-API route
    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: { email: user.email },
        updateData: { fieldWeaknesses: user.fieldWeaknesses }
      })
    });

    if (response.ok) {
      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);
    } else {
      console.error('Failed to update user');
    }

    overWord();
  };

  return (
    <div 
    className={`flex items-center justify-center flex-col w-full mx-auto h-[84vh] bg-[aliceblue] rounded-[2%] border-2 border-[#facc15] border-b border-purple-400 p-4`}
    style={{
      borderLeft: isLeft ? '8px solid #facc15' : 'none',
      borderRight: !isLeft ? '8px solid #facc15' : 'none'
    }}
    >
      <div className="w-full " style={{ transform: `translateX(${distance}cm)`, transition: 'transform 0.3s ease-in-out' }}>
        <p className="text-7xl flex items-center justify-center flex-row w-[96vw] h-[42vh]">
          {words[currentWordIndex]}
        </p>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 px-4 rounded flex-1"
          onClick={moveLeft}
        >
          Move Left
        </button>
        <button
          className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 px-4 rounded flex-1"
          style={{
            borderLeft: isLeft ? '8px solid #facc15' : 'none',
            borderRight: !isLeft ? '8px solid #facc15' : 'none'
          }}
          onClick={() => setIsLeft(!isLeft)}
        >
          Choose a Side
        </button>

        <button
          className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 px-4 rounded flex-1"
          onClick={moveRight}
        >
          Move Right
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-1"
          onClick={overWord}
        >
          Change Word
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-1"
          onClick={handleMistake}
        >
          Mistake
        </button>
      </div>
      <button
        className="bg-yellow-400 hover:bg-yellow-700 text-slate-800 font-bold py-2 px-4 rounded w-full"
        onClick={() => setOpen(!open)}
      >
        Please read the details before use
      </button>
      <Popup open={open} setOpen={setOpen} />
    </div>
  );
}