"use client";
import React, { useContext, useEffect, useState } from 'react';
import styles from './style.module.css';
import { MyContext, MyProvider } from '../context/DataContext';
import Blur2 from '@/components/Blur2'


let indexB = 0, indexF = 0;

const ColorChangerComp = ({ user }) => {
    const { data, updateData } = useContext(MyContext);

    useEffect(() => {
        updateData();
        console.log(data);
    }, []);

    const colors = ['#c30000', 'blue', 'green', 'yellow', 'purple', 'orange', 'lightblue'];
    const words = ["9", "5", "7", "1", "8", "2", "4", "6", "0", "1", "A", "S", "d", "F", "E", "e", "V", "G", "i", "m", "N", "b", "z", "W"];

    const [fontColor1, setFontColor1] = useState('#ff0000'); // מגדיר state לצבע הראשון של הפונט
    const [backgroundColor1, setBackgroundColor1] = useState('#00ff00'); // מגדיר state לצבע הראשון של הרקע
    const [backgroundColor2] = useState('transparent'); // מגדיר state לצבע השני של הרקע
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

    const handleMistake  = async () => {
        let taut = { background_color: backgroundColor1, font_color: fontColor1 };
        user.colorWeaknesses.push(taut);
        // שליחת הבקשה ל-API route
        const response = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: { email: user.email },
                updateData: { colorWeaknesses: user.colorWeaknesses }
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
        <div className={`w-2/3 ${styles.contain} `}>
            <div className={styles.inContain}>
                <div className={styles.rekaBackground} style={backgroundTileStyle}>
                    <div className={styles.font} style={fontTileStyle}>
                        {words[currentWordIndex]}
                    </div>
                </div>
                <br />
                <button
                    className="bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold py-2 px-4 rounded min-w-96"
                    onClick={changeBackgroundColor}>רקע</button>
                <br />
                <button
                    className="bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold py-2 px-4 rounded min-w-96"
                    onClick={changeFontColor}>פונט</button>
                <div>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-48"
                        onClick={overWord}>change word</button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded min-w-48"
                        onClick={()=>handleMistake()}>Mistake</button>
                </div>
            </div>
        </div>
    );
};

const ColorChanger = ({ user }) => (
    <MyProvider>
        <ColorChangerComp user={user} />
        {/* <Blur2 user={user}/> */}
    </MyProvider>
);

export default ColorChanger;
