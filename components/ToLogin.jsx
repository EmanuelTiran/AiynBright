import Link from 'next/link'
import React from 'react'

export default function ToLogin() {
  return (
    <div className="flex  justify-center items-center  h-screen flex-col min-w-full">
    <h1 className='shake text-yellow-400 text-4xl text-center'>User does not exist or is not authenticated! <br />
      <Link
        href={'/login'}
        replace 
        className='underline'
      >please login  </Link>
    </h1>
  </div>
  )
}
