import { unstable_noStore } from 'next/cache'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'



export default async function Recommendation() {

   const res = await fetch("https://jsonplaceholder.typicode.com/posts", {  cache: 'no-store'})
   const recommendations = await res.json()
   const date = new Date().toISOString().slice(0, 19)

   return (
      <div className='p-8 flex justify-center gap-4 flex-wrap'>
         {date}
         {recommendations.map((recommendation) => (
            <Link href={`/recommendations/${recommendation.id}`} className='border-2 p-4 border-gray-400' key={recommendation.id}>
               <h1 >{recommendation.title}</h1>
               <p>{recommendation.body}</p>
            </Link>
         ))}
      </div>
   )
}
