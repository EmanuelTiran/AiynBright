
import { readCarpetsService, createCarpetService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import Link from 'next/link'
import style from './style.module.css'
import Blur from '@/components/Blur'
import Blur2 from '@/components/Blur2'
import SnellenChart from '@/components/Snellen'




export default async function MyCart() {
  unstable_noStore()
  // await new Promise(resolve => setTimeout(resolve, 7000))
  await connectToMongo()

  return (
    <div className={style.container}>
      {/* <Blur /> */}
      <Blur2 />
      {/* <SnellenChart /> */}
    </div>
  )
}
