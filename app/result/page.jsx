import { readCarpetsService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function Page({ searchParams: { search } }) {
   await connectToMongo()
   const result = await readCarpetsService({
      $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]
   })

   return (
      <div>
         <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {result.map((carpet) => (
               <Link className='flex flex-col' key={carpet._id} href={`/airbnb/${carpet._id}`} >
                  <Image src={carpet.image} alt={carpet.title} width={600} height={400} />
                  {carpet.name}
               </Link>
            ))}
         </section>
      </div>
   )
}
