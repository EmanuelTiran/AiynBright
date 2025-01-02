"use client";
import React, { useEffect, useState } from 'react';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { MdBlurOn } from "react-icons/md";
import { IoColorPaletteSharp } from "react-icons/io5";
import { GiField } from "react-icons/gi";
import { MdAdminPanelSettings } from "react-icons/md";
import Navlink from '../Navlink';
import style from './style.module.css';
import Logo from '../Logo';
import { authAction, logoutAction } from '@/server/BL/actions/login.action';
import Link from 'next/link';

const brightColors = ["text-red-500", "text-purple-500", "text-teal-400", "text-yellow-400", "text-orange-400", "text-blue-200"];

const linksList = [
   { href: '/', text: 'Home', icon: <AiFillHome className="text-xl" /> },
   { href: '/about', text: 'About', icon: <BiInfoCircle className="text-xl" /> },
   { href: '/user', text: 'User Status', icon: <FaUser className="text-xl" /> },
   { href: '/blur', text: 'Blur Vision', icon: <MdBlurOn className="text-xl" /> },
   { href: '/color', text: 'Color Vision', icon: <IoColorPaletteSharp className="text-xl" /> },
   { href: '/field', text: 'Field Vision', icon: <GiField className="text-xl" /> },
];

export default function Header() {
   const [isManager, setIsManager] = useState(false);
   const [isUser, setIsUser] = useState(false);

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
      <header className={`${style.header} flex justify-between items-center bg-gray-800 p-4`}>
         <nav className="flex space-x-4">
            {linksList.map((link, index) => (
               <Navlink
                  key={link.href}
                  href={link.href}
                  colorText={brightColors[index % brightColors.length]}
               >
                  <div className="flex flex-col items-center">
                     {link.icon}
                     <span className="text-xs hidden sm:block">{link.text}</span>
                  </div>
               </Navlink>
            ))}
            {isManager && (
               <Navlink href="/admin" colorText="text-orange-200">
                  <div className="flex flex-col items-center">
                     <MdAdminPanelSettings className="text-xl" />
                     <span className="text-xs hidden sm:block">Admin</span>
                  </div>
               </Navlink>
            )}
         </nav>

         <div className="flex items-center space-x-4">
            {isUser ? (
               <form action={logoutAction}>
                  <button
                     className="text-orange-200 cursor-pointer"
                     title='logout'
                     type="submit"
                     onClick={() => {
                        setIsUser(false);
                        logoutAction();
                     }}
                  >
                     <div className="flex flex-col items-center">
                        <RiLogoutCircleRLine className="text-xl" />
                        <span className="text-xs hidden sm:block">Logout</span>
                     </div>
                  </button>
               </form>
            ) : (
               <Link href="/login" className="text-orange-200 cursor-pointer" title='login'>
                  <div className="flex flex-col items-center">
                     <IoMdLogIn className="text-xl" />
                     <span className="text-xs hidden sm:block">Login</span>
                  </div>
               </Link>
            )}
            <div className="hidden md:block">
               <Logo />
            </div>         </div>
      </header>
   );
}