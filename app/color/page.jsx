
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import style from './style.module.css'
import ColorChanger from '@/components/Color'
import SnellenChart from '@/components/Snellen'
import { readUserByFieldService } from '@/server/BL/services/user.service'
import { authAction } from '@/server/BL/actions/login.action'
import Link from 'next/link'



export default async function Color() {
  await connectToMongo();

  const authData = await authAction();

  if (!authData || !authData.userToken) {
    return (
      <div className="flex  justify-center items-center  h-screen flex-col min-w-full">
        <h1 className='shake text-orange-400 text-4xl text-center'>User does not exist or is not authenticated! <br />
          <Link
            className='underline'
            href={'login'}
          >please login  </Link>
        </h1>
      </div>);
  }

  const { email } = authData.userToken;

  let currentUser = await readUserByFieldService({ email });
  const simplifiedUser = {
    username: currentUser.username,
    password: currentUser.password,
    email: currentUser.email,
    colorWeaknesses: currentUser.colorWeaknesses.map(weakness => ({
      background_color: weakness.background_color,
      font_color: weakness.font_color
    }))
  };
  unstable_noStore()
  // await new Promise(resolve => setTimeout(resolve, 7000))

  return (
    <div className={style.container}>
      <ColorChanger user={simplifiedUser} />
    </div>
  )
}
