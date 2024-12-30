import Link from 'next/link'
import React from 'react'
import ColorDetails from './ColorDetails'
import SizesDetails from './SizesDetails'
import FieldDetails from './FieldDetails'

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
      <ColorDetails simplifiedUser={simplifiedUser} />

      <SizesDetails simplifiedUser={simplifiedUser} />

      <FieldDetails simplifiedUser={simplifiedUser} />
    </div>
  )
}
