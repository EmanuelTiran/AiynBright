"use client"
import React, { useState, useCallback } from 'react';
import { Button } from "@mui/material";

const characters = '1234567890אבגדהוזחטיכלמנסעפצקרשת';
const initialSize = 48;

const getRandomCharacter = () => characters[Math.floor(Math.random() * characters.length)];

const getRandomButtons = (correctChar) => {
    const buttons = [correctChar];
    while (buttons.length < 4) {
        const char = getRandomCharacter();
        if (!buttons.includes(char)) {
            buttons.push(char);
        }
    }
    return buttons.sort(() => Math.random() - 0.5);
};

const RandomCharacterGame = () => {
    const [character, setCharacter] = useState(getRandomCharacter());
    const [buttons, setButtons] = useState(getRandomButtons(character));
    const [size, setSize] = useState(initialSize);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [countTrue, setCountTrue] = useState(0);
    const [countFalse, setCountFalse] = useState(0);

    const handleButtonClick = useCallback((clickedChar, index) => {
        console.log({ countFalse })
        const correct = clickedChar === character;
        setIsCorrect(correct);
        setClickedIndex(index);
        if (correct) {
            setCountTrue(prev => prev + 1);
            setCountFalse(0);
        } else {
            setCountTrue(0);
            setCountFalse(prev => prev + 1);
        }
        if (correct && countTrue === 1) {
            setCountTrue(0)
            setSize((prevSize) => Math.max(prevSize - 4, 4));
            console.log({ size })
        }

        // Set a timeout to reset the game state
        setTimeout(() => {
            const newChar = getRandomCharacter();
            setCharacter(newChar);
            setButtons(getRandomButtons(newChar));
            setClickedIndex(null);
            setIsCorrect(null);
        }, 500); // Wait for 1 second before resetting
    }, [character]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-gray-100 rounded-lg">
            <div
                className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md"
                style={{ fontSize: `${size}px` }}
            >
                {character}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {!(countFalse === 3) ?
                    buttons.map((char, index) => (
                        <Button
                            key={index}
                            onClick={() => handleButtonClick(char, index)}
                            className={`
                          w-32 h-32 rounded-full
                          text-teal-600 text-8xl
                          border-4  border-teal-600
                          flex items-center justify-center
                          transition-all duration-300 shadow-2xl
                          ${clickedIndex === index
                                    ? isCorrect
                                        ? 'bg-green-500 hover:bg-gray-600 border-green-600'
                                        : 'bg-red-500 hover:bg-red-600 border-red-600'
                                    : 'bg-white hover:bg-gray-200'
                                }
                        `}
                            disabled={clickedIndex !== null}
                        >
                            {char}
                        </Button>
                    )) : null

                }
            </div>
        </div>
    );
};

export default RandomCharacterGame;