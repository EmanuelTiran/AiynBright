import { connectToMongo } from '@/server/connectToMongo'
import { unstable_noStore } from 'next/cache'
import Link from 'next/link'
import style from './style.module.css'

import { cookies } from 'next/headers'
import { createUser } from '@/server/DL/controllers/user.controller'
import { readUsersService } from '@/server/BL/services/user.service'
import SighnIn from '@/components/SighnIn'
import Login from '../components/Login'
import { authAction } from '@/server/BL/actions/login.action'
import CurrentTime from '@/components/CurrentTime'
import SiteDescription from '@/components/SiteDescription'

export default async function Home() {
  // unstable_noStore()
  // await new Promise(resolve => setTimeout(resolve, 7000))
  await connectToMongo()
  // createUser(usersJson.map((user, i)=>({ ...user})))

  // const cookiesss = cookies().getAll()
  // const users = await readUsersService();

  // const carpets = await readCarpetsService();

  const isUser = await authAction();

  return (
<div>
  {/* <SiteDescription/> */}
    {isUser ? (
        <Login />
    ) : (
        <SighnIn />
    )}
    {/* <CurrentTime/> */}
</div>
  )
}
