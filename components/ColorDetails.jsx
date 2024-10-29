import Link from 'next/link'
import React from 'react'

export default function ColorDetails({simplifiedUser}) {
    return (
        <>
            <h3 className="text-xl font-semibold mb-4">Color Weaknesses</h3>
            <ul className="space-y-4 mb-8">
                {simplifiedUser.colorWeaknesses.length === 0 ? (
                    <li className="border p-4 rounded-lg bg-white shadow-sm">
                        <a href="color" className="text-red-500 underline">
                            You don't have any diagnosis about your vision colors, Click here to explore color options
                        </a>
                    </li>
                ) : (
                    simplifiedUser.colorWeaknesses.map((weakness, index) => (
                        <Link
                            key={index} // Move the key prop here
                            href={`color/${weakness.background_color}_${weakness.font_color}`}
                        >
                            <li className="border p-4 rounded-lg bg-white shadow-sm">
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-medium text-gray-600">Background:</span>
                                    <span
                                        className="text-gray-800 px-2 py-1 rounded-md"
                                        style={{
                                            backgroundColor: weakness.background_color,
                                            width: '80px'
                                        }}
                                    >
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
                    ))
                )}
            </ul>
        </>
    )
}
