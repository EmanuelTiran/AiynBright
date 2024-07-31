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

const usersJson = [
  {
    username: 'Alice',
    password: 'password123',
    email: 'alice@example.com',
    colorWeaknesses: [
      {
        background_color: 'blue',
        font_color: 'white'
      },
      {
        background_color: 'black',
        font_color: 'yellow'
      }
    ],
    sizeWeaknesses: [
      {
        fontSize: 14,
        distance: 20
      },
      {
        fontSize: 16,
        distance: 25
      }
    ]
  },
  {
    username: 'Bob',
    password: 'bobpassword',
    email: 'bob@example.com',
    colorWeaknesses: [
      {
        background_color: 'green',
        font_color: 'black'
      },
      {
        background_color: 'white',
        font_color: 'blue'
      }
    ],
    sizeWeaknesses: [
      {
        fontSize: 12,
        distance: 18
      },
      {
        fontSize: 18,
        distance: 30
      }
    ]
  },
  {
    username: 'Clice',
    password: 'abc123',
    email: 'clice@example.com',
    colorWeaknesses: [
      { background_color: 'blue', font_color: 'white' },
      { background_color: 'green', font_color: 'black' }
    ],
    sizeWeaknesses: [
      { fontSize: 12, distance: 5 },
      { fontSize: 14, distance: 7 }
    ]
  },
  {
    username: 'Dob',
    password: 'bobpass',
    email: 'dob@example.com',
    colorWeaknesses: [
      { background_color: 'red', font_color: 'black' },
      { background_color: 'yellow', font_color: 'blue' }
    ],
    sizeWeaknesses: [
      { fontSize: 16, distance: 8 },
      { fontSize: 18, distance: 10 }
    ]
  },
  {
    username: 'Hob',
    password: 'Hobpass',
    email: 'hob@example.com',
    colorWeaknesses: [
      { background_color: 'green', font_color: 'lightblue' },
      { background_color: 'yellow', font_color: 'blue' }
    ],
    sizeWeaknesses: [
      { fontSize: 16, distance: 8 },
      { fontSize: 18, distance: 10 }
    ]
  },
];
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
    {isUser ? (
        <Login />
    ) : (
        <SighnIn />
    )}
    {/* <CurrentTime/> */}
</div>
  )
}
