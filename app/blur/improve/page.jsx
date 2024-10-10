import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import { authAction } from '@/server/BL/actions/login.action'
import { readUserByFieldService } from '@/server/BL/services/user.service'
import Blur from '@/components/Blur'
import ToLogin from '@/components/ToLogin'




export default async function BlurPage() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  await connectToMongo();
  const authData = await authAction();
  if (!authData || !authData.userToken) return <ToLogin/>

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
    <div >
      <Blur user={simplifiedUser} />
    </div>
  )
}