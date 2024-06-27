"use client"
import React, { useState } from 'react';
import style from './style.module.css';
import Popup from '../Popup';
let indexSize = 0, indexWord = 0;
export default function Blur() {
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

    return (

        <div className={style.contain}>
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
                className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded min-w-96"
                onClick={increaseFontSize}>Increase Font Size</button><br />
            <button
                className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded min-w-96"
                onClick={decreaseFontSize}>decrease Font Size</button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-96"
                onClick={overWord}>change word</button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-96"
                onClick={()=>setOpen(!open)}>Please read the details before use</button>
            <Popup open={open} setOpen={setOpen} />
        </div>

    );
}
