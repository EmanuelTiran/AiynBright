
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import style from './style.module.css'
import { authAction } from '@/server/BL/actions/login.action'
import { readUserByFieldService } from '@/server/BL/services/user.service'
import Link from 'next/link'
import Blur from '@/components/Blur'




export default async function BlurPage() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  await connectToMongo();
  const authData = await authAction();
  if (!authData || !authData.userToken) {
    return (
      <div className="flex  justify-center items-center  h-screen flex-col min-w-full">
        <h1 className='shake text-yellow-400 text-4xl text-center'>User does not exist or is not authenticated! <br />
          <Link
            href={'login'}
            className='underline'
          >please login  </Link>
        </h1>
      </div>
    );
  }

  const { email } = authData.userToken;

  let currentUser = await readUserByFieldService({ email });
  const simplifiedUser = {
    username: currentUser.username,
    password: currentUser.password,
    email: currentUser.email,
    sizeWeaknesses: currentUser.sizeWeaknesses.map(weakness => ({
      fontSize: weakness.fontSize,
      distance: weakness.distance,
      date: weakness.date
    })),
  };
  unstable_noStore()
  return (
    <div className={style.container}>
      <Blur user={simplifiedUser} />
    </div>
  )
}
