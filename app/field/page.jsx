
import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import style from './style.module.css'
import Field from '@/components/Field'
import { authAction } from '@/server/BL/actions/login.action'
import { readUserByFieldService } from '@/server/BL/services/user.service'
import Login from '@/components/Login'
import Link from 'next/link'
import ToLogin from '@/components/ToLogin'




export default async function FieldPage() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  await connectToMongo();
  const authData = await authAction();
  // console.log({ authData })
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
    <div className={style.container}>
      <Field user={simplifiedUser} />
    </div>
  )
}
