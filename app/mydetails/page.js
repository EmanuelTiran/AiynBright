
import { readCarpetsService, createCarpetService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import style from './style.module.css'
import Images from '@/components/Images'
import Checkout from '@/components/Checkout'



export default async function Details() {
    unstable_noStore()
    // await new Promise(resolve => setTimeout(resolve, 7000))
    await connectToMongo()

    return (
        <div className={style.container}>
            My Details
        </div>
    )
}
