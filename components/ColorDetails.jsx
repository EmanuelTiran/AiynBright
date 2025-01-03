"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColorDetails({ simplifiedUser }) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 text-center">
        Color Vision Profile
      </h3>

      {simplifiedUser.colorWeaknesses.length === 0 ? (
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
              <p className="text-gray-700 mb-2">No Color Vision Data Available</p>
              <a
                href="color"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                Take Color Vision Test
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
        <div >
          <div className='flex justify-center'>

          <button
            onClick={() => setShowTable(!showTable)}
            className="mb-4 px-6 py-2 bg-orange-400 text-white rounded-lg shadow hover:bg-orange-500 transition-colors "
          >
            {showTable ? 'Hide Details' : 'Show Details'}
          </button>
          </div>
          <AnimatePresence>
            {showTable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="overflow-x-auto overflow-y-auto max-h-64 md:max-h-64 
                [&::-webkit-scrollbar]:w-2 
                [&::-webkit-scrollbar]:h-2
                [&::-webkit-scrollbar-thumb]:bg-orange-400 
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-gray-100">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="text-center text-xs md:text-sm font-semibold text-gray-900">
                            <th className="border border-gray-200 px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap">
                              Background
                            </th>
                            <th className="border border-gray-200 px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap">
                              Text Color
                            </th>
                            <th className="border border-gray-200 px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap">
                              Test date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {simplifiedUser.colorWeaknesses.map((weakness, index) => (
                            <tr
                              key={index}
                              className="transition-colors hover:bg-gray-50 odd:bg-gray-50 even:bg-white"
                            >
                              <td className="border border-gray-200 px-2 md:px-6 py-2 md:py-4 text-center">
                                <Link
                                  href={`color/${weakness.background_color}_${weakness.font_color}`}
                                >
                                  <div
                                    className="w-12 md:w-16 h-6 md:h-8 mx-auto rounded-md shadow-inner"
                                    style={{ backgroundColor: weakness.background_color }}
                                  />
                                </Link>
                              </td>
                              <td className="border border-gray-200 px-2 md:px-6 py-2 md:py-4 text-center">
                                <Link
                                  href={`color/${weakness.background_color}_${weakness.font_color}`}
                                >
                                  <div
                                    className="w-12 md:w-16 h-6 md:h-8 mx-auto rounded-md shadow-inner"
                                    style={{ backgroundColor: weakness.font_color }}
                                  />
                                </Link>
                              </td>
                              <td className="border border-gray-200 px-2 md:px-6 py-2 md:py-4 text-center">
                                <Link
                                  href={`color/${weakness.background_color}_${weakness.font_color}`}
                                >
                                  <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                                    {new Date(weakness.date).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
