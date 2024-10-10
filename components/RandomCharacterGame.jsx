"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@mui/material";
import ResultTestBlur from './ResultTestBlur';

const characters = '1234567890אבגדהוזחטיכלמנסעפצקרשת';
const initialSize = 14.6;

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

const RandomCharacterGame = ({ user }) => {
    const [character, setCharacter] = useState('');
    const [buttons, setButtons] = useState([]);
    const [size, setSize] = useState(initialSize);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [countTrue, setCountTrue] = useState(0);
    const [countFalse, setCountFalse] = useState(0);
    const [isLeftEye, setIsLeftEye] = useState(false);

    useEffect(() => {
        const initialChar = getRandomCharacter();
        setCharacter(initialChar);
        setButtons(getRandomButtons(initialChar));
    }, []);

    const handleButtonClick = useCallback((clickedChar, index) => {
        console.log({ size });
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
            setCountTrue(0);
            setSize((prevSize) => Math.max(prevSize - 1.5, 4));
        }

        // Set a timeout to reset the game state
        setTimeout(() => {
            const newChar = getRandomCharacter();
            setCharacter(newChar);
            setButtons(getRandomButtons(newChar));
            setClickedIndex(null);
            setIsCorrect(null);
        }, 500);
    }, [character]);

    useEffect(() => {
        const updateUser = async () => {
            if (countFalse === 3) {
                let taut = { fontSize: size, distance: 1, eye: isLeftEye ? "left" : "right" };
                user.sizeWeaknesses.push(taut);

                try {
                    const response = await fetch('/api/updateUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            filter: { email: user.email },
                            updateData: { sizeWeaknesses: user.sizeWeaknesses }
                        })
                    });

                    if (response.ok) {
                        const updatedUser = await response.json();
                        console.log('User updated successfully:', updatedUser);
                    } else {
                        console.error('Failed to update user');
                    }
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        };

        updateUser();
    }, [countFalse]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-gray-100 rounded-lg">
            <div
                className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md"
                style={{ fontSize: `${size}mm` }}
            >
                {character}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {!(countFalse === 3) ?
                    buttons.map((char, index) => (
                        <Button
                            key={index}
                            onClick={() => handleButtonClick(char, index)}
                            variant="outlined"
                            sx={{
                                border: '2px solid #facc15',
                                color: 'black', // Set text color to black
                                fontSize: '14.6mm', // Adjust font size as needed
                                padding: '10px 20px',
                                width: '100px', // Width for square shape
                                height: '100px',
                            }}
                            disabled={clickedIndex !== null}
                            className={`${clickedIndex === index
                                ? isCorrect
                                    ? 'bg-green-500 hover:bg-gray-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                : 'bg-white hover:bg-gray-200'
                            }`}
                        >
                            {char}
                        </Button>
                    )) : <ResultTestBlur size={size} setSize={setSize} isLeftEye={isLeftEye} setIsLeftEye={setIsLeftEye} setCountFalse={setCountFalse} />
                }
            </div>
        </div>
    );
};

export default RandomCharacterGame;

// className={`
//     w-32 h-32 rounded-full
//     text-yellow-400 text-8xl
//     flex items-center justify-center
//     transition-all duration-300 shadow-2xl
//     ${clickedIndex === index
//         ? isCorrect
//             ? 'bg-green-500 hover:bg-gray-600'
//             : 'bg-red-500 hover:bg-red-600'
//         : 'bg-white hover:bg-gray-200'
//     }
// `}