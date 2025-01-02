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
    fieldWeaknesses: user.fieldWeaknesses.map(weakness => ({
      side: weakness.side,
      distance: weakness.distance,
      date: weakness.date
    }))
  }));

  return (
    <>
      {isManager ?
        <ArrUsers users={filteredUsers} />
        : <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative">
            <h1 className="text-4xl font-bold text-yellow-100 animate-bounce">
              Access Denied
            </h1>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-yellow-100 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-100 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-yellow-100 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
      }
    </>
  )
}
