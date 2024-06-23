
import { readCarpetsService, createCarpetService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import style from './style.module.css'
import Images from '@/components/Images'
import Checkout from '@/components/Checkout'
import Color from '@/components/Color'
import SnellenChart from '@/components/Snellen'



export default async function MyCart() {
  unstable_noStore()
  // await new Promise(resolve => setTimeout(resolve, 7000))
  await connectToMongo()
   
  return (
    <div className={style.container}>
      {/* <Color/> */}
      <SnellenChart/>
    </div>
  )
}
