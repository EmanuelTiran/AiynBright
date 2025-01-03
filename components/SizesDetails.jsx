"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";

// רישום כל רכיבי ה-Chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SizesDetails({ simplifiedUser }) {
  const { sizeWeaknesses } = simplifiedUser;
  const [showCharts, setShowCharts] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const getDataByEye = (eye) =>
    sizeWeaknesses.filter((weakness) => weakness.eye === eye);

  const generateChartData = (eye) => {
    const data = getDataByEye(eye);
    return {
      labels: data.map((w) => new Date(w.date).toLocaleDateString()),
      datasets: [
        {
          label: `Font Size - ${eye} eye`,
          data: data.map((w) => w.fontSize),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3,
        },
        {
          label: `Distance - ${eye} eye`,
          data: data.map((w) => w.distance),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 text-center">
        Blur Vision Profile
      </h3>

      <ul className="space-y-4">
        {sizeWeaknesses.length === 0 ? (
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
                  href="blur"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Take Blur Vision Test
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
            <div className="mb-4  flex justify-center">
              <button
                onClick={() => setShowCharts(!showCharts)}
                className="mr-4 px-6 py-2 bg-yellow-400 text-white rounded-lg shadow hover:bg-yellow-500 transition-colors"
              >
                {showCharts ? "Hide Charts" : "Show Charts"}
              </button>
              <button
                onClick={() => setShowTable(!showTable)}
                className="px-6 py-2 bg-yellow-400 text-white rounded-lg shadow hover:bg-yellow-500 transition-colors"
              >
                {showTable ? "Hide Table" : "Show Table"}
              </button>
            </div>
            <AnimatePresence>
              {showCharts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-2">Right Eye</h4>
                    <Line data={generateChartData("right")} />
                  </div>
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-2">Left Eye</h4>
                    <Line data={generateChartData("left")} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showTable && (
                <motion.div
                  className="overflow-hidden border rounded-lg bg-white shadow-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="overflow-y-auto max-h-64 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-yellow-400 [&::-webkit-scrollbar-track]:bg-gray-100">
                    <table className="table-auto w-full border-collapse border border-gray-200">
                      <thead >
                        <tr className="text-center text-sm font-semibold text-gray-900   tracking-wider">
                          <th className="border border-gray-300 px-4 py-2  text-sm font-semibold  tracking-wider">Font Size</th>
                          <th className="border border-gray-300 px-4 py-2 text-sm font-semibold  tracking-wider">Distance</th>
                          <th className="border border-gray-300 px-4 py-2  text-sm font-semibold  tracking-wider">Eye</th>
                          <th className="border border-gray-300 px-4 py-2  text-sm font-semibold  tracking-wider">Date</th>
                          <th className="border border-gray-300 px-4 py-2  text-sm font-semibold  tracking-wider">Action</th>
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
                              {weakness.eye || "right"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {new Date(weakness.date).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <Link
                                href={`blur/improve/${weakness.fontSize}_${weakness.distance}_${weakness.eye || "right"}`}
                                className="text-yellow-400 underline"
                              >
                                Improve
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
      </ul>
    </div>
  );
}
