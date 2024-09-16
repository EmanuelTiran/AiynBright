
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import Blur from '@/components/Blur'
import { authAction } from '@/server/BL/actions/login.action'
import { readUserByFieldService } from '@/server/BL/services/user.service'
import ToLogin from '@/components/ToLogin'




export default async function page({ params: { detail } }) {
  function extract_size(detail) {
    const size = detail.split('_');

    return {
      fontSize: size[0],
      distance: size[1]
    };
  }
  let sizeUser = extract_size(detail);
  console.log({ sizeUser })

  await new Promise(resolve => setTimeout(resolve, 3000))
  await connectToMongo();
  const authData = await authAction();
  console.log({ authData })
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
    }))
  };
  unstable_noStore()
  return (
    <div >
      <Blur user={simplifiedUser} sizeUser={sizeUser} />
    </div>
  )
}
