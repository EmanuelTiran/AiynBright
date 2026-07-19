import React from 'react';
import { connectToMongo } from '@/server/connectToMongo';
import { unstable_noStore } from 'next/cache';
import { authAction } from '@/server/BL/actions/login.action';
import { readUserByFieldService } from '@/server/BL/services/user.service';
import Blur from '@/components/Blur';
import ToLogin from '@/components/ToLogin';
import Link from 'next/link';
import RandomCharacterGame from '@/components/RandomCharacterGame';

const AnimatedLink = ({ href, children }) => (
    <Link
        href={href}
        className="
      block mb-4 bg-gradient-to-r from-yellow-200 to-yellow-800 
      text-white font-bold py-2 px-4 rounded-full shadow-lg 
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
            eye: weakness.eye,
            fontSize: weakness.fontSize,
            distance: weakness.distance,
            date: weakness.date
        })),
    };

    unstable_noStore();

    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <RandomCharacterGame user={simplifiedUser} />
        </div>
    );
}