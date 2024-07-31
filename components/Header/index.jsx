"use client";

import React, { useEffect, useState } from 'react';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";

import Navlink from '../Navlink';
import style from './style.module.css';

import Logo from '../Logo';
import { authAction, logoutAction } from '@/server/BL/actions/login.action';
import Link from 'next/link';

const linksList = [
   { href: '/', text: 'Home' },
   { href: '/about', text: 'About' },
   { href: '/user', text: 'User Details' },
   { href: '/blur', text: 'Blur Vision' },
   { href: '/color', text: 'Color Vision' },
   { href: '/field', text: 'Field Vision' },
];

export default function Header() {
   const [isManager, setIsManager] = useState(false);
   const [isUser, setIsUser] = useState(false);

   const brightColors = ["text-red-500", "text-blue-200", "text-green-400", "text-yellow-400", "text-orange-400", "text-purple-500"]; // Array of colors for each letter in "BRIGHT"


   useEffect(() => {
      async function checkAuth() {
         try {
            const authResult = await authAction();
            if (authResult) {
               setIsManager(authResult.isManager);
               setIsUser(authResult.isUser);
            }
         } catch (error) {
            console.log(error);
         }
      }
      checkAuth();
   }, []);

   return (
      <header className={style.header + " flex justify-between items-center bg-gray-800"}>
         <span className={style.refs}>
            {linksList.map((link, index) => (
               <Navlink key={link.href} href={link.href} colorText={brightColors[index % brightColors.length]}>
                  {link.text}
               </Navlink>
            ))}
            {isManager && (
               <Navlink href="/admin" colorText={"text-orange-200"}>
                  Admin
               </Navlink>
            )}
         </span>

         {isUser ? <form action={logoutAction}>
            <button className="text-orange-200 cursor-pointer font-thin" title='logout' type="submit" onClick={() => {
               setIsUser(false);
               logoutAction();
            }}>               <RiLogoutCircleRLine />
            </button>
         </form> : <Link href={"login"}
            className="text-orange-200 cursor-pointer font-thin" title='login'
         ><IoMdLogIn /></Link>}
         <Logo />
      </header>
   );
}
