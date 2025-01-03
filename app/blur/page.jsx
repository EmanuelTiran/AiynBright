import React from 'react';
import { connectToMongo } from '@/server/connectToMongo';
import { unstable_noStore } from 'next/cache';
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';
import Blur from '@/components/Blur';
import ToLogin from '@/components/ToLogin';
import Link from 'next/link';

const AnimatedLink = ({ href, children }) => (
  <Link 
    href={href} 
    className="
      block mb-4 bg-gradient-to-r from-yellow-300 to-yellow-500 
      text-white font-bold py-2 px-4 rounded-md shadow-lg 
      transition-all duration-300 ease-in-out
      hover:shadow-xl hover:from-yellow-200 hover:to-yellow-800
      hover:scale-105 active:scale-95
      transform hover:-translate-y-1 active:translate-y-0
      flex items-center justify-center
    "
  >
    {children}
  </Link>
);

export default async function BlurPage() {
  // await new Promise(resolve => setTimeout(resolve, 3000));
  await connectToMongo();
  const authData = await authAction();
  
  if (!authData || !authData.userToken) return <ToLogin />;
  
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
  
  unstable_noStore();
  
  return (
  <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl space-y-6 max-w-md w-full transform transition-all duration-500 ease-in-out hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Blur Options</h1>
        {simplifiedUser.sizeWeaknesses.length > 0 && (
          <AnimatedLink href="blur/improve/14.6_1_left">Improve Blur</AnimatedLink>
        )}
        <AnimatedLink href="/blur/diagnosis">Blur Diagnosis</AnimatedLink>
      </div>
    </div>
  );
}