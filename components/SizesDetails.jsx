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

            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Font Size</th>
                  <th className="border border-gray-300 px-4 py-2">Distance</th>
                  <th className="border border-gray-300 px-4 py-2">Eye</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sizeWeaknesses.map((weakness, index) => (
                  <tr key={index} className="odd:bg-gray-50 even:bg-white">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {weakness.fontSize}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {weakness.distance}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {weakness.eye || 'right'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {new Date(weakness.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <Link
                        href={`blur/improve/${weakness.fontSize}_${weakness.distance}_${weakness.eye || 'right'
                          }`}
                        className="text-blue-500 hover:underline"
                      >
                        Improve
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </>
        )}
      </ul>
    </div>
  )
}
