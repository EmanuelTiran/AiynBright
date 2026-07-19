import React from 'react';


const ProgressBar = ({ size }) => {
    const calculateProgress = () => {
        const totalRange = 14.6 - 2;
        const currentProgress = 14.6 - size;
        const percentage = (currentProgress / totalRange) * 100;
        return Math.min(Math.max(percentage, 0), 100);
    };

    return (
        <div className="w-full max-w-md mx-auto mt-4 mb-4">
            <div className="bg-gray-200 rounded-full h-4">
                <div
                    className="bg-yellow-400 h-4 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${calculateProgress()}%` }}
                />
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-600">
                <span>14.6mm</span>
                <span>2mm</span>
            </div>
        </div>
    );
};

export default ProgressBar;