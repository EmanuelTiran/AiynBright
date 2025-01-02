"use client"
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FieldDetails({ simplifiedUser }) {
    const [showDetails, setShowDetails] = useState(false); // מצב להצגת הפרטים

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 text-center">Field Weaknesses</h3>

            {simplifiedUser.fieldWeaknesses.length === 0 ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-700 mb-2">No Field Vision Data Available</p>
                            <a
                                href="field"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Take Field Vision Test
                                <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                <div className='flex justify-center'>

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
                    >
                        {showDetails ? "Hide Details" : "Show Details"}
                    </button>
                </div>

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                className="overflow-hidden border rounded-lg bg-white shadow-sm"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="overflow-y-auto max-h-64 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-track]:bg-gray-100"> {/* תכונת גלילה לגובה מוגדר */}
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="sticky top-0">
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 px-6 py-3 text-sm font-semibold  tracking-wider">Side</th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 px-6 py-3 text-sm font-semibold  tracking-wider">
                                                    Distance
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 px-6 py-3 text-sm font-semibold  tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {simplifiedUser.fieldWeaknesses.map((weakness, index) => (
                                                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                                                    <td className="px-6 py-4">
                                                        <Link href={`field/${weakness.side}_${weakness.distance}`}>
                                                            <span className="text-gray-800">{weakness.side}</span>
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link href={`field/${weakness.side}_${weakness.distance}`}>
                                                            <span className="text-gray-800">{weakness.distance}</span>
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link href={`field/${weakness.side}_${weakness.distance}`}>
                                                            <span className="text-gray-800">
                                                                {new Date(weakness.date).toLocaleDateString()}
                                                            </span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}
