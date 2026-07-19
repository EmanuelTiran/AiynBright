"use client"
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import Popup from '../Popup';
import Button from '@mui/material/Button';

export default function Field({ user, distanceUser }) {
  const words = ["9", "5", "7", "1", "8", "2", "4", "6", "0", "1", "A", "S", "d", "F", "E", "X", "V", "G", "I", "M", "N", "B", "Z", "W"];
  // const sizes =  [-18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
  ; // ערכים בס"מ למיקום
  const fillSizes = () => {
    const sizes = [];
    for (let i = -24; i <= 24; i += 2) {
      sizes.push(i);
    }
    return sizes;
  }



  const [open, setOpen] = useState(false);
  const [isLeft, setIsLeft] = useState(distanceUser?.side === 'left' ? true : false);
  const [sizes, setSizes] = useState(fillSizes());
  const [distance, setDistance] = useState(distanceUser ? distanceUser.distance : 0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [firstTime, setFirstTime] = useState(true);
  const [currentSizeIndex, setCurrentSizeIndex] = useState(distanceUser ? sizes.indexOf(Number(distanceUser.distance)) : Math.floor(sizes.length / 2)); // TODO : לעדכן את המרחק מהפאראם לפי האינדקס!!!


  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
      setDistance(distanceUser ? distanceUser.distance : sizes[currentSizeIndex]);
    } else {
      setDistance(sizes[currentSizeIndex]);
    }
    const side = isLeft ? 'left' : 'right';
    const distance = sizes[currentSizeIndex];
    const newPathname = `/field/${side}_${distance}`;

    // Update the URL without using search parameters
    window.history.pushState({}, '', newPathname);
  }, [currentSizeIndex, isLeft]);

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
      className={`flex items-center justify-center flex-col w-full mx-auto h-[84vh] bg-[aliceblue]  border-2 border-[#bfdbfe] border-b border-purple-400 p-4`}
      style={{
        borderLeft: isLeft ? '32px solid #bfdbfe' : 'none',
        borderRight: !isLeft ? '32px solid #bfdbfe' : 'none',
        transition: 'border 0.3s ease'

      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#bfdbfe',
          color: '#1F2937',
          fontWeight: 'bold',
          padding: '8px 16px',
          borderRadius: '0.375rem',
          '&:hover': {
            backgroundColor: '#D97706',
          },
        }}
        onClick={() => setOpen(!open)}
      >
        Please read the details before use
      </Button>
      <div className="w-full " style={{ transform: `translateX(${distance}cm)`, transition: 'transform 0.3s ease-in-out' }}>
        <p className="text-7xl flex items-center justify-center flex-row w-[96vw] h-[42vh]">
          {words[currentWordIndex]}
        </p>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1e293b',
            '&:hover': {
              backgroundColor: '#334155',
            },
            color: '#bfdbfe',
            fontWeight: 'bold',
            py: 1,
            px: 2,
            clipPath: 'polygon(20% 0, 100% 0, 80% 50%, 100% 100%, 20% 100%, 0 50%)',
            borderRadius: 0,
            flex: 1,
          }}
          onClick={moveLeft}
        >
           Left
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1e293b',
            '&:hover': {
              backgroundColor: '#334155',
            },
            color: '#bfdbfe',
            fontWeight: 'bold',
            py: 1,  // Reduced padding
            px: 2,  // Reduced padding
            flex: 1,
            borderRadius: '0 0 0 0', // Rounded right corners, square left corners
            borderLeft: isLeft ? '8px solid #bfdbfe' : 'none',
            borderRight: !isLeft ? '8px solid #bfdbfe' : 'none',
          }}
          onClick={() => setIsLeft(!isLeft)}
        >
          Choose a Side
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1e293b',
            '&:hover': {
              backgroundColor: '#334155',
            },
            color: '#bfdbfe',
            fontWeight: 'bold',
            py: 1,
            px: 2,
            clipPath: 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%, 20% 50%)',
            borderRadius: 0,
            flex: 1,
          }}
          onClick={moveRight}
        >
           Right
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#48bb78', // equivalent to bg-green-500
            '&:hover': {
              backgroundColor: '#2f855a', // equivalent to hover:bg-green-700
            },
            color: 'white', // equivalent to text-white
            fontWeight: 'bold',
            py: 1,  // Reduced padding for smaller size
            px: 2,  // Reduced padding for smaller size
            borderRadius: '8px',
            flex: 1,
          }}
          onClick={overWord}
        >
          Change Word
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#f56565', // equivalent to bg-red-500
            '&:hover': {
              backgroundColor: '#c53030', // equivalent to hover:bg-red-700
            },
            color: 'white', // equivalent to text-white
            fontWeight: 'bold',
            py: 1,  // Reduced padding for smaller size
            px: 2,  // Reduced padding for smaller size
            borderRadius: '8px',
            flex: 1,
          }}
          onClick={handleMistake}
        >
          Mistake
        </Button>
      </div>

      <Popup open={open} setOpen={setOpen} type={'field'} />
    </div>
  );
}
