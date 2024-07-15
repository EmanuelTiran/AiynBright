import React from 'react';
import style from './style.module.css';
// import img from '../../public/img/favicon'; 

export default function Logo() {
  const brightColors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500", "text-orange-400"]; // Array of colors for each letter in "BRIGHT"
  const CharBright = ["B", "r", "i", "g", "h", "t"]
  return (
    <div className="text-center relative">
    <span className="text-2xl relative z-10">
      <span className="font-thin text-orange-200">AYIN</span>
      {brightColors.map((color, index) => (
        <span key={index} className={`font-bold text-orange-200 ${style.blur}`}>
          {CharBright[index]}
        </span>
      ))}
    </span>
    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 ${style['blinking-eye']}`}>
      <img src="favicon.ico" alt="favicon" width={50} />
    </div>
  </div>
  );
}
