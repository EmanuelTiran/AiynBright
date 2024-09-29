import React from 'react'
import { authAction } from '@/server/BL/actions/login.action';
import { readUsersService } from '@/server/BL/services/user.service';
import { unstable_noStore } from 'next/cache';
import ArrUsers from '@/components/ArrUsers';

export default async function admin() {
  unstable_noStore()

  const { isManager } = await authAction();
  const users = await readUsersService({});
  const filteredUsers = users.map(user => ({
    username: user.username,
    password: user.password,
    email: user.email,
    colorWeaknesses: user.colorWeaknesses.map(weakness => ({
      background_color: weakness.background_color,
      font_color: weakness.font_color,
      date: weakness.date
    })),
    sizeWeaknesses: user.sizeWeaknesses.map(weakness => ({
      eye: weakness.eye,
      fontSize: weakness.fontSize,
      distance: weakness.distance,
      date: weakness.date
    })),
    fieldWeaknesses:user.fieldWeaknesses.map(weakness => ({
      side: weakness.side,
      distance: weakness.distance,
      date: weakness.date
    }))
  }));

  return (
    <>
      {isManager ?
        <ArrUsers users={filteredUsers} />
        : <h1>no exist!!!</h1>
      }
    </>
  )
}
