import React from 'react';
import style from './style.module.css'; 

export default function Logo() {
    const brightColors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500", "text-orange-500"]; // Array of colors for each letter in "BRIGHT"
    const CharBright = ["B", "r", "i", "g", "h", "t"]
    return (
        <span className="text-2xl">
          <span className="font-thin">AYIN</span>
          {brightColors.map((color, index) => (
            <span key={index} className={`font-bold ${color} ${style.blur}`}>{CharBright[index]}</span>
          ))}
        </span>
    );
  }
