
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import Field from '@/components/Field'
import { authAction } from '@/server/BL/actions/login.action'
import { readUserByFieldService } from '@/server/BL/services/user.service'
import ToLogin from '@/components/ToLogin'




export default async function page({ params: { detail } }) {
  function extract_size(detail) {
    const size = detail.split('_');

    return {
      side: size[0],
      distance: size[1]
    };
  }
  let distanceUser = extract_size(detail);
  // await new Promise(resolve => setTimeout(resolve, 3000))
  await connectToMongo();
  const authData = await authAction();
  console.log({ distanceUser })
  if (!authData || !authData.userToken) return <ToLogin/>

  const { email } = authData.userToken;

  let currentUser = await readUserByFieldService({ email });
  const simplifiedUser = {
    username: currentUser.username,
    password: currentUser.password,
    email: currentUser.email,
    fieldWeaknesses: currentUser.fieldWeaknesses.map(weakness => ({
      side: weakness.side,
      distance: weakness.distance,
      date: weakness.date
    })),
  };
  unstable_noStore()
  return (
    <div >
      <Field user={simplifiedUser} distanceUser={distanceUser} />
    </div>
  )
}
