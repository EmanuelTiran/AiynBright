import React from 'react';
import Link from 'next/link';

export default function FieldDetails({ simplifiedUser }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Field Weaknesses</h3>
      {simplifiedUser.fieldWeaknesses.length === 0 ? (
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <a href="field" className="text-red-500 underline">
            You don't have any diagnosis about your vision fields, Click here to explore field options
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Side</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Distance</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
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
      )}
    </div>
  );
}