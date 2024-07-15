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
  const authData = await authAction();
  console.log({ authData })
  if (!authData || !authData.userToken) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1 className='shake text-orange-200 font-thin text-4xl'>User does not exist or is not authenticated!</h1>
      </div>
    );
  }

  const { email } = authData.userToken;
  const { isUser } = authData;
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
      <Blur2 user={simplifiedUser} />
    </div>
  )
}
