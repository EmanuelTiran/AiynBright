import React from 'react';
import style from './style.module.css';
import Link from 'next/link';

export default function Logo() {
  const brightColors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500", "text-orange-400"]; // Array of colors for each letter in "BRIGHT"
  const CharBright = ["B", "r", "i", "g", "h", "t"]
  return (
<Link href="/" title='home'>
  <div className="flex justify-center items-center">
    <div className={`${style['blinking-eye']}`}>
      <img src="favicon.ico" alt="favicon" width={50} />
    </div>
    <div className="text-center relative">
      <span className="text-2xl relative z-10">
        <span className="font-thin text-orange-200">AYIN</span>
        {brightColors.map((color, index) => (
          <span key={index} className={`font-bold text-orange-200 ${style.blur}`}>
            {CharBright[index]}
          </span>
        ))}
      </span>
    </div>
  </div>
</Link>

  );
}