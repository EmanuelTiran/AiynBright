import React from 'react'

export default function DetailUser({ simplifiedUser }) {
    return (
<div className="mx-auto w-2/3">
  <h2 className="text-3xl font-light text-green-400 mb-6 border-b border-green-400 pb-2">User Details</h2>

  <div className="bg-gray-200 rounded-lg p-6 backdrop-filter backdrop-blur-lg mb-8 shadow-lg">
    <p className="text-xl text-gray-800 mb-4 flex items-center">
      <span className="font-semibold">Username:</span>
      <span className="ml-2 bg-gray-300 px-3 py-1 rounded-md">{simplifiedUser.username}</span>
    </p>
    <p className="text-xl text-gray-800 mb-4 flex items-center">
      <span className="font-semibold">Email:</span>
      <span className="ml-2 bg-gray-300 px-3 py-1 rounded-md">{simplifiedUser.email}</span>
    </p>
  </div>

  <h3 className="text-2xl font-thin text-green-400 mt-8 mb-4">Color Weaknesses</h3>
  <ul className="space-y-4 mb-8">
    {simplifiedUser.colorWeaknesses.map((weakness, index) => (
      <li key={index} className="bg-gray-200 rounded-lg p-4 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-800 font-medium">Background:</span>
          <span className="px-4 py-2 rounded-md" style={{ backgroundColor: weakness.background_color }}>
            {weakness.background_color}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-800 font-medium">Font:</span>
          <span className="px-4 py-2 rounded-md text-gray-800" style={{ backgroundColor: weakness.font_color }}>
            {weakness.font_color}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-800 font-medium">Date:</span>
          <span className="px-4 py-2 rounded-md text-gray-800">
            {new Date(weakness.date).toLocaleDateString()}
          </span>
        </div>
      </li>
    ))}
  </ul>

  <h3 className="text-2xl font-thin text-green-400 mt-8 mb-4">Size Weaknesses</h3>
  <ul className="space-y-4">
    {simplifiedUser.sizeWeaknesses.map((weakness, index) => (
      <li key={index} className="bg-gray-200 rounded-lg p-4 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-800 font-medium">Font Size:</span>
          <span className="px-4 py-2 rounded-md bg-gray-300">
            {weakness.fontSize}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-800 font-medium">Distance:</span>
          <span className="px-4 py-2 rounded-md bg-gray-300">
            {weakness.distance}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-800 font-medium">Date:</span>
          <span className="px-4 py-2 rounded-md text-gray-800">
            {new Date(weakness.date).toLocaleDateString()}
          </span>
        </div>
      </li>
    ))}
  </ul>
</div>
    )
}
