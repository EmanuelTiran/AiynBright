import React from 'react'

export default function DetailUser({ simplifiedUser }) {
    return (
        <div className="bg-gradient-to-br from-blue-950 to-blue-600 p-8 rounded-lg shadow-2xl max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-white pb-2">User Details</h2>

    <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-filter backdrop-blur-lg mb-8 shadow-lg">
        <p className="text-xl text-white mb-4 flex items-center">
            <span className="font-semibold">Username:</span>
            <span className="ml-2 bg-white bg-opacity-20 px-3 py-1 rounded-md">{simplifiedUser.username}</span>
        </p>
        <p className="text-xl text-white mb-4 flex items-center">
            <span className="font-semibold">Email:</span>
            <span className="ml-2 bg-white bg-opacity-20 px-3 py-1 rounded-md">{simplifiedUser.email}</span>
        </p>
    </div>

    <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Color Weaknesses</h3>
    <ul className="space-y-4 mb-8">
        {simplifiedUser.colorWeaknesses.map((weakness, index) => (
            <li key={index} className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-lg shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Background:</span>
                    <span className="px-4 py-2 rounded-md" style={{ backgroundColor: weakness.background_color }}>
                        {weakness.background_color}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Font:</span>
                    <span className="px-4 py-2 rounded-md text-black" style={{ backgroundColor: weakness.font_color }}>
                        {weakness.font_color}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Date:</span>
                    <span className="px-4 py-2 rounded-md text-black">
                        {new Date(weakness.date).toLocaleDateString()}
                    </span>
                </div>
            </li>
        ))}
    </ul>

    <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Size Weaknesses</h3>
    <ul className="space-y-4">
        {simplifiedUser.sizeWeaknesses.map((weakness, index) => (
            <li key={index} className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-lg shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Font Size:</span>
                    <span className="px-4 py-2 rounded-md bg-white bg-opacity-20">
                        {weakness.fontSize}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Distance:</span>
                    <span className="px-4 py-2 rounded-md bg-white bg-opacity-20">
                        {weakness.distance}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Date:</span>
                    <span className="px-4 py-2 rounded-md text-black">
                        {new Date(weakness.date).toLocaleDateString()}
                    </span>
                </div>
            </li>
        ))}
    </ul>
</div>

    )
}
