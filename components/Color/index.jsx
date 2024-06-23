"use client"
import React, { useState } from 'react';
import styles from './style.module.css'; // עדכן את הנתיב בהתאם


let indexB = 0;
let indexF = 0;
const ColorChanger = () => {

    const colors = ['#c30000', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const words = ["9", "5", "7", "1", "8", "2", "4", "6", "0", "1", "A", "S", "d", "F", "E", "e", "V", "G", "i", "m", "N", "b", "z", "W"]; // Array of words


    const [fontColor1, setFontColor1] = useState('#ff0000'); // מגדיר state לצבע הראשון של הפונט
    const [backgroundColor1, setBackgroundColor1] = useState('#00ff00'); // מגדיר state לצבע הראשון של הרקע
    const [backgroundColor2, setBackgroundColor2] = useState('transparent'); // מגדיר state לצבע השני של הרקע
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const changeFontColor = () => {
        indexF = (indexF + 1) % colors.length;
        if (indexB === indexF) indexF = (indexF + 1) % colors.length;
        setFontColor1(colors[indexF]);
    };
    
    const changeBackgroundColor = () => {
        indexB = (indexB + 1) % colors.length;
        if (indexB === indexF) indexB = (indexB + 1) % colors.length;
        setBackgroundColor1(colors[indexB]); 
    };

    const overWord = () => {
        setCurrentWordIndex((currentWordIndex - 1 + words.length) % words.length); // Cycle through words
    };

    const fontTileStyle = {
        backgroundImage:
            `linear-gradient(45deg, ${fontColor1} 25%, transparent 25%, transparent 75%, ${fontColor1} 75%, ${fontColor1}),
            linear-gradient(45deg, ${fontColor1} 25%, transparent 25%, transparent 75%, ${fontColor1} 75%, ${fontColor1})`, // יוצר אפקט פסיפס לפונט
    };

    const backgroundTileStyle = {
        backgroundImage:
            `linear-gradient(45deg, ${backgroundColor1} 25%, ${backgroundColor2} 25%, ${backgroundColor2} 75%, ${backgroundColor1} 75%, ${backgroundColor1}),
            linear-gradient(45deg, ${backgroundColor1} 25%, ${backgroundColor2} 25%, ${backgroundColor2} 75%, ${backgroundColor1} 75%, ${backgroundColor1})`, // יוצר אפקט פסיפס לרקע
    };

    return (
        <div className={styles.contain}>
            <div
                className={styles.inContain}
            >

                <div
                    className={styles.rekaBackground}
                    style={backgroundTileStyle} // מיישם את הסטייל הדינמי לרקע
                >
                    <div
                        className={styles.font}
                        style={fontTileStyle} // מיישם את הסטייל הדינמי לפונט
                    >
                        {words[currentWordIndex]}
                    </div>
                </div> <br />
                <button
                    className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded min-w-96"

                    onClick={changeBackgroundColor}>רקע</button><br /> {/* כפתור לשינוי צבע הרקע */}
                <button
                    className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded min-w-96"
                    onClick={changeFontColor}>פונט</button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-96"
                    onClick={overWord}>change word</button>
            </div>
        </div>
    );
};




export default ColorChanger;
