
import { readCarpetsService, createCarpetService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import style from './style.module.css'
import ColorChanger from '@/components/Color'
import SnellenChart from '@/components/Snellen'



export default async function Color() {
  unstable_noStore()
  // await new Promise(resolve => setTimeout(resolve, 7000))
  await connectToMongo()
   
  return (
    <div className={style.container}>
      <ColorChanger/>
      {/* <SnellenChart/> */}
    </div>
  )
}
