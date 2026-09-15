"use client";
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { MdBlurOn } from "react-icons/md";
import { IoColorPaletteSharp } from "react-icons/io5";
import { GiField } from "react-icons/gi";
import { MdAdminPanelSettings, MdClose, MdMenu } from "react-icons/md";
import style from './style.module.css';
import Logo from '../Logo';
import { authAction, logoutAction } from '@/server/BL/actions/login.action';
import Link from 'next/link';

// Keep each destination's existing color when changing its position.
const mainLinks = [
   { href: '/', text: 'Home', Icon: AiFillHome, color: 'text-red-500' },
   { href: '/blur', text: 'Blur Vision', Icon: MdBlurOn, color: 'text-yellow-400' },
   { href: '/color', text: 'Color Vision', Icon: IoColorPaletteSharp, color: 'text-orange-400' },
   { href: '/field', text: 'Field Vision', Icon: GiField, color: 'text-blue-200' },
   { href: '/user', text: 'User Status', Icon: FaUser, color: 'text-teal-400' },
];

function HeaderLink({ href, text, Icon, color, pathname, onNavigate }) {
   const active = pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`));

   return (
      <Link
         href={href}
         aria-current={active ? 'page' : undefined}
         className={`${style.navLink} ${color} ${active ? style.active : ''}`}
         onClick={onNavigate}
      >
         <Icon aria-hidden="true" focusable="false" />
         <span>{text}</span>
      </Link>
   );
}

export default function Header() {
   const [isManager, setIsManager] = useState(false);
   const [isUser, setIsUser] = useState(false);
   const [menuOpen, setMenuOpen] = useState(false);
   const menuButton = useRef(null);
   const pathname = usePathname();

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
      <header
         className={`${style.header} bg-gray-800`}
         onKeyDown={(event) => {
            if (event.key === 'Escape' && menuOpen) {
               setMenuOpen(false);
               menuButton.current?.focus();
            }
         }}
      >
         <div className={style.brand}>
            <Logo />
         </div>

         <button
            ref={menuButton}
            type="button"
            className={`${style.menuButton} text-orange-200`}
            aria-expanded={menuOpen}
            aria-controls="header-navigation"
            onClick={() => setMenuOpen((open) => !open)}
         >
            {menuOpen ? <MdClose aria-hidden="true" /> : <MdMenu aria-hidden="true" />}
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
         </button>

         <div id="header-navigation" className={`${style.navigation} ${menuOpen ? style.expanded : ''}`}>
            <nav aria-label="Main navigation" className={style.mainNav}>
               <ul className={style.mainLinks}>
                  {mainLinks.map((link) => (
                     <li key={link.href}>
                        <HeaderLink {...link} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
                     </li>
                  ))}
               </ul>
            </nav>

            <div className={style.utilities}>
               <nav aria-label="Utility navigation">
                  <ul className={style.utilityLinks}>
                     <li>
                        <HeaderLink href="/about" text="About" Icon={BiInfoCircle} color="text-purple-500" pathname={pathname} onNavigate={() => setMenuOpen(false)} />
                     </li>
                     {isManager && (
                        <li>
                           <HeaderLink href="/admin" text="Admin" Icon={MdAdminPanelSettings} color="text-orange-200" pathname={pathname} onNavigate={() => setMenuOpen(false)} />
                        </li>
                     )}
                  </ul>
               </nav>

               <div className={style.accountAction}>
                  {isUser ? (
                     <form action={logoutAction}>
                        <button
                           className={`${style.navLink} ${style.logout} text-orange-200`}
                           title="logout"
                           type="submit"
                           onClick={() => {
                              setIsUser(false);
                              logoutAction();
                           }}
                        >
                           <RiLogoutCircleRLine aria-hidden="true" focusable="false" />
                           <span>Logout</span>
                        </button>
                     </form>
                  ) : (
                     <HeaderLink href="/login" text="Login" Icon={IoMdLogIn} color="text-orange-200" pathname={pathname} onNavigate={() => setMenuOpen(false)} />
                  )}
               </div>
            </div>
         </div>
      </header>
   );
}
