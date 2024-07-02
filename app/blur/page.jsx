
import { readCarpetsService, createCarpetService } from '@/server/BL/services/carpet.service'
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import Link from 'next/link'
import style from './style.module.css'
import Blur from '@/components/Blur'
import Blur2 from '@/components/Blur2'
import SnellenChart from '@/components/Snellen'
import { authAction } from '@/server/BL/actions/login.action'
import { readUserByFieldService } from '@/server/BL/services/user.service'




export default async function BlurPage() {
  await connectToMongo();
  const { isUser, userToken: { email } } = await authAction();

  let currentUser = await readUserByFieldService({ email });
  const simplifiedUser = {
    username: currentUser.username,
    password: currentUser.password,
    email: currentUser.email,
    colorWeaknesses: currentUser.colorWeaknesses.map(weakness => ({
      background_color: weakness.background_color,
      font_color: weakness.font_color,
      date: weakness.date
    })),
    sizeWeaknesses: currentUser.sizeWeaknesses.map(weakness => ({
      fontSize: weakness.fontSize,
      distance: weakness.distance,
      date: weakness.date
    }))
  };
  unstable_noStore()
  return (
    <div className={style.container}>
      {/* <Blur /> */}
      <Blur2 user={simplifiedUser} />
      {/* <SnellenChart /> */}
    </div>
  )
}
