"use client"
import React, { useState } from 'react';
import style from './style.module.css';
import Popup from '../Popup';
let indexSize = 0;
export default function Blur({ user }) {
    const words = ["9", "5", "7", "1", "8", "2", "4", "6", "0", "1", "A", "S", "d", "F", "E", "e", "V", "G", "i", "m", "N", "b", "z", "W"];
    const sizes = [14.6, 11, 8.8, 7.3, 5.8, 4.4, 3.66, 2.9, 2.2, 1.46];
    const [open, setOpen] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const [fontSize, setFontSize] = useState(14.6); // Initial font size

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

    const handleMistake  = async () => {
        let taut = { fontSize: fontSize, distance: 1 };
        user.sizeWeaknesses.push(taut);
        // שליחת הבקשה ל-API route
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

        overWord();
    };

    return (

        <div className={`${style.contain} border-b border-green-400`}>
            <p
                className={style.inContain}
            >Font size: {fontSize}mm</p>
            <p
                style={{ fontSize: `${fontSize}mm` }}
                className={style.inContain}>{words[currentWordIndex]}</p>
            <input
                type="number"
                value={fontSize}
                onChange={changeFontSize}
                className="border border-gray-300 rounded px-2 py-1 mb-4"
                placeholder="Enter font size"
            />
            <button
                className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 px-4 rounded min-w-96"
                onClick={increaseFontSize}>Increase Font Size</button><br />
            <button
                className="bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2 px-4 rounded min-w-96"
                onClick={decreaseFontSize}>decrease Font Size</button>
            <div>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-48"
                    onClick={overWord}>change word</button>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded min-w-48"
                    onClick={() => handleMistake()}>Mistake</button>
            </div>
            <button
                className="bg-yellow-400 hover:bg-yellow-700 text-slate-800 font-bold py-2 px-4 rounded min-w-96"
                onClick={() => setOpen(!open)}>Please read the details before use</button>
            <Popup open={open} setOpen={setOpen} />
        </div>

    );
}
