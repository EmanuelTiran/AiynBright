"use server"
const jwt = require('jsonwebtoken');

import { loginAction } from '@/server/BL/actions/login.action';
import { cookies } from 'next/headers'
import Login from '@/components/Login';
import SighnIn from '@/components/SighnIn';

export default async function Signin() {
  const cookieStore = cookies()


  return (<>
    <SighnIn />
  </>
  )
}
