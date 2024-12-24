"use client"
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import Button from '@mui/material/Button';

import Popup from '../Popup';
let indexSize = 0;
export default function Blur({ user, sizeUser }) {
  // const words = ["9", "5", "7", "1", "8", "2", "4", "6", "0", "1", "A", "S", "d", "F", "E", "e", "V", "G", "i", "m", "N", "b", "z", "W"];
  const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli fruit', 'vanilla', 'watermelon'];
  const sizes = [14.6, 11, 8.8, 7.3, 5.8, 4.4, 3.66, 2.9, 2.2, 1.46];
  const [open, setOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fontSize, setFontSize] = useState(sizeUser ? sizeUser.fontSize : 14.6); // Initial font size
  const [isLeftEye, setIsLeftEye] = useState(sizeUser?.eye === "left" ? true : false); // Initial eye

  useEffect(() => {
    const eye = isLeftEye ? "left" : "right";
    const newPathname = `/blur/improve/${fontSize}_1_${eye}`;
    window.history.pushState({}, '', newPathname);
  }, [fontSize, isLeftEye]);

  const increaseFontSize = () => {
    if (indexSize > 0) indexSize = (indexSize - 1);
    setFontSize(sizes[indexSize]); // Increase font size by 2px
  };
  const decreaseFontSize = () => {
    indexSize = (indexSize + 1) % sizes.length;
    setFontSize(sizes[indexSize]); // decrease font size by 2px
  };
  const changeFontSize = (event) => {
    setFontSize(parseInt(event.target.value) || 0); // Update font size based on user input
  };
  const overWord = () => {
    setCurrentWordIndex((currentWordIndex - 1 + words.length) % words.length); // Cycle through words
  };

  const handleMistake = async () => {
    try {
      const taut = {
        fontSize: fontSize,
        distance: 1,
        eye: isLeftEye ? 'left' : 'right'
      };

      const updatedWeaknesses = [...user.sizeWeaknesses, taut];

      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: { email: user.email },
          updateData: { sizeWeaknesses: updatedWeaknesses }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      user.sizeWeaknesses = updatedWeaknesses;
      console.log('User updated successfully:', updatedUser);
      overWord();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (

    <div className={`${style.contain} border-b border-green-400 p-4`}>
      <Button
        variant="contained"
        style={{
          backgroundColor: '#FBBF24',
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
      <p className={style.inContain}>Font size: {fontSize}mm</p>
      <p
        style={{ fontSize: `${fontSize}mm` }}
        className={`${style.inContain} transition-all duration-300 ease-in-out`}
      >
        {words[currentWordIndex]}
      </p>
      <input
        type="number"
        value={fontSize}
        onChange={changeFontSize}
        className="border border-gray-300 rounded px-2 p-1 mb-4  text-center w-96"
        placeholder="Enter font size"
        min="1"
        max="25"
      />
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 px-4 rounded flex-1"
          onClick={increaseFontSize}
        >
          Increase Font Size
        </button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1e293b',
            '&:hover': {
              backgroundColor: '#334155',
            },
            color: '#facc15',
            fontWeight: 'bold',
            py: 1,  // Reduced padding
            px: 2,  // Reduced padding
            flex: 1,
            borderRadius: '0 0 0 0', // Rounded right corners, square left corners
            borderLeft: isLeftEye ? '8px solid #facc15' : 'none',
            borderRight: !isLeftEye ? '8px solid #facc15' : 'none',
          }}
          onClick={() => setIsLeftEye(!isLeftEye)}
        >
          Choose a Eye
        </Button>
        <button
          className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 px-4 rounded flex-1"
          onClick={decreaseFontSize}
        >
          Decrease Font Size
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
          onClick={() => handleMistake()}
        >
          Mistake
        </button>
      </div>
      <Popup open={open} setOpen={setOpen} type={'blur'} />
    </div>

  );
}
