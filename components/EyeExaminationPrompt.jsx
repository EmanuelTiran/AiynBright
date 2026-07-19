import React from 'react';

const EyeExaminationPrompt = ({ isLeftEye }) => {
    const instructions = [
        `Cover your ${isLeftEye ? "right" : "left"} eye`,
        `examine your ${isLeftEye ? "left" : "right"} eye`,
        `Tap the button corresponding to the character, 1 meter away`
    ];

    return (
        <div className="w-full border-2 border-yellow-400 rounded-lg p-5 text-left font-sans text-gray-800 text-lg shadow-md transition-transform duration-300 ">
        <ol className="list-decimal list-outside space-y-2 ml-6">
            {instructions.map((instruction, index) => (
                <li key={index} className="leading-relaxed">
                    {instruction}
                </li>
            ))}
        </ol>
    </div>
    );
};

export default EyeExaminationPrompt;