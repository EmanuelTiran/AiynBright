import Link from 'next/link'
import React from 'react'

export default function DetailUser({ simplifiedUser }) {
  return (
    <div className="mx-auto w-2/3 p-6 bg-gray-50 shadow-sm rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">User Details</h2>

      <div className="mb-8">
        <p className="flex justify-between items-center border-b py-3 text-lg">
          <span className="font-medium text-gray-600">Username:</span>
          <span className="text-gray-800">{simplifiedUser.username}</span>
        </p>
        <p className="flex justify-between items-center border-b py-3 text-lg">
          <span className="font-medium text-gray-600">Email:</span>
          <span className="text-gray-800">{simplifiedUser.email}</span>
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Color Weaknesses</h3>
      <ul className="space-y-4 mb-8">
        {simplifiedUser.colorWeaknesses.map((weakness, index) => (

          <Link
            href={`color/${weakness.background_color}_${weakness.font_color}`}
          >


            <li key={index} className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Background:</span>
                <span
                  className="text-gray-800 px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: weakness.background_color,
                    width: '80px'
                  }}              >
                  {weakness.background_color}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Font:</span>
                <span
                  className="text-gray-800 px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: weakness.font_color,
                    width: '80px'
                  }}
                >
                  {weakness.font_color}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-800">
                  {new Date(weakness.date).toLocaleDateString()}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-4">Size Weaknesses</h3>
      <ul className="space-y-4">
        {simplifiedUser.sizeWeaknesses.map((weakness, index) => (
          <Link
            href={`blur/${weakness.fontSize}_${weakness.distance}`}
          >

            <li key={index} className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Font Size:</span>
                <span className="text-gray-800">{weakness.fontSize}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Distance:</span>
                <span className="text-gray-800">{weakness.distance}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-800">
                  {new Date(weakness.date).toLocaleDateString()}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mb-4">Field Weaknesses</h3>
      <ul className="space-y-4">
        {simplifiedUser.fieldWeaknesses.map((weakness, index) => (
          <Link href={`field/${weakness.side}_${weakness.distance}`} key={index}>
            <li className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Side:</span>
                <span className="text-gray-800">{weakness.side}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Distance:</span>
                <span className="text-gray-800">{weakness.distance}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-800">
                  {new Date(weakness.date).toLocaleDateString()}
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
