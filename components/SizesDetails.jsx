"use client"
import Link from 'next/link'
import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// רישום כל רכיבי ה-Chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function SizesDetails({ simplifiedUser }) {
  const { sizeWeaknesses } = simplifiedUser

  // סינון נתונים לפי עין (ימין/שמאל)
  const getDataByEye = (eye) =>
    sizeWeaknesses.filter((weakness) => weakness.eye === eye)

  // פונקציה שמחזירה אובייקט נתונים לגרף
  const generateChartData = (eye) => {
    const data = getDataByEye(eye)
    return {
      labels: data.map((w) => new Date(w.date).toLocaleDateString()), // תאריכים כציר ה-X
      datasets: [
        {
          label: `Font Size - ${eye} eye`,
          data: data.map((w) => w.fontSize),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
        },
        {
          label: `Distance - ${eye} eye`,
          data: data.map((w) => w.distance),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
        },
      ],
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Size Weaknesses</h3>
      <ul className="space-y-4">
        {sizeWeaknesses.length === 0 ? (
          <li className="border p-4 rounded-lg bg-white shadow-sm">
            <a href="blur" className="text-red-500 underline">
              You don't have any diagnosis about your vision blur, Click here to explore blur options
            </a>
          </li>
        ) : (
          <>
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Right Eye</h4>
              <Line data={generateChartData('right')} />
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Left Eye</h4>
              <Line data={generateChartData('left')} />
            </div>

            <ul className="space-y-4">
              {sizeWeaknesses.map((weakness, index) => (
                <Link
                  key={index}
                  href={`blur/improve/${weakness.fontSize}_${weakness.distance}_${
                    weakness.eye || 'right'
                  }`}
                >
                  <li className="border p-4 rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-gray-600">Font Size:</span>
                      <span className="text-gray-800">{weakness.fontSize}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-gray-600">Distance:</span>
                      <span className="text-gray-800">{weakness.distance}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-gray-600">Eye:</span>
                      <span className="text-gray-800">{weakness.eye}</span>
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
          </>
        )}
      </ul>
    </div>
  )
}
