"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { MdBlurOn, MdAdminPanelSettings, MdClose, MdMenu } from "react-icons/md";
import { IoColorPaletteSharp } from "react-icons/io5";
import { GiField } from "react-icons/gi";
import { FiActivity, FiCrosshair, FiDroplet, FiEye, FiHome } from "react-icons/fi";
import style from './style.module.css';
import Logo from '../Logo';
import { authAction, logoutAction } from '@/server/BL/actions/login.action';
import Link from 'next/link';

// Desktop icons and labels retain the existing navigation design.
const mainLinks = [
   { href: '/', text: 'Home', mobileText: 'Home', Icon: AiFillHome, MobileIcon: FiHome, color: 'text-red-500' },
   { href: '/blur', text: 'Blur Vision', mobileText: 'Blur', Icon: MdBlurOn, MobileIcon: FiEye, color: 'text-yellow-400' },
   { href: '/color', text: 'Color Vision', mobileText: 'Color', Icon: IoColorPaletteSharp, MobileIcon: FiDroplet, color: 'text-orange-400' },
   { href: '/field', text: 'Field Vision', mobileText: 'Field', Icon: GiField, MobileIcon: FiCrosshair, color: 'text-blue-200' },
   { href: '/user', text: 'User Status', mobileText: 'Status', Icon: FaUser, MobileIcon: FiActivity, color: 'text-teal-400' },
];

function isActive(pathname, href) {
   return pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`));
}

function HeaderLink({ href, text, Icon, color, pathname, onNavigate }) {
   const active = isActive(pathname, href);

   return (
      <Link
         href={href}
         data-header-link
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
   const [navCollapsed, setNavCollapsed] = useState(false);
   const menuButton = useRef(null);
   const header = useRef(null);
   const activeIndicator = useRef(null);
   const pathname = usePathname();

   useLayoutEffect(() => {
      const container = header.current;
      const indicator = activeIndicator.current;
      let frame;
      let disposed = false;

      function measureIndicator() {
         const activeLink = container.querySelector(`.${style.navigation} [data-header-link][aria-current="page"]`);
         const rect = activeLink?.getBoundingClientRect();

         if (!rect?.width || !rect.height) {
            indicator.removeAttribute('data-ready');
            indicator.removeAttribute('data-visible');
            return;
         }

         const bounds = container.getBoundingClientRect();
         const x = rect.left - bounds.left - container.clientLeft + container.scrollLeft;
         const y = rect.bottom - bounds.top - container.clientTop + container.scrollTop - indicator.offsetHeight;
         indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
         indicator.style.width = `${rect.width}px`;
         indicator.style.backgroundColor = 'var(--header-accent)';
         indicator.setAttribute('data-visible', '');

         if (!indicator.hasAttribute('data-ready')) {
            indicator.getBoundingClientRect();
            indicator.setAttribute('data-ready', '');
         }
      }

      function scheduleMeasurement() {
         cancelAnimationFrame(frame);
         frame = requestAnimationFrame(measureIndicator);
      }

      measureIndicator();
      const observer = new ResizeObserver(scheduleMeasurement);
      observer.observe(container);
      container.querySelectorAll('[data-header-link], nav, [data-header-utilities]').forEach((element) => observer.observe(element));
      window.addEventListener('resize', scheduleMeasurement);
      document.fonts.addEventListener('loadingdone', scheduleMeasurement);
      document.fonts.ready.then(() => { if (!disposed) scheduleMeasurement(); });

      return () => {
         disposed = true;
         observer.disconnect();
         cancelAnimationFrame(frame);
         window.removeEventListener('resize', scheduleMeasurement);
         document.fonts.removeEventListener('loadingdone', scheduleMeasurement);
      };
   }, [pathname, menuOpen, isManager, isUser]);

   useEffect(() => {
      let lastY = window.scrollY;
      let directionStart = lastY;
      let direction = 0;

      function update() {
         const y = Math.max(0, window.scrollY);
         if (window.matchMedia('(min-width: 64rem)').matches) {
            lastY = y;
            return;
         }
         if (y < 32) {
            setNavCollapsed(false);
            directionStart = y;
         } else if (!menuOpen) {
            const nextDirection = Math.sign(y - lastY);
            if (nextDirection && nextDirection !== direction) {
               direction = nextDirection;
               directionStart = lastY;
            }
            if (direction > 0 && y > 96 && y - directionStart > 24) {
               setNavCollapsed(true);
            } else if (direction < 0 && directionStart - y > 18) {
               setNavCollapsed(false);
            }
         }
         lastY = y;
      }

      function onScroll() {
         update();
      }

      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
         window.removeEventListener('scroll', onScroll);
      };
   }, [menuOpen]);

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
      <div className={style.headerShell}>
         <header
            ref={header}
            className={style.header}
            data-home={pathname === '/' ? '' : undefined}
            data-user={isUser ? '' : undefined}
            data-collapsed={navCollapsed ? '' : undefined}
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

            <div className={style.mobileAccount}>
               <Link href={isUser ? '/user' : '/login'} onClick={() => setMenuOpen(false)}>
                  {isUser ? 'Account' : 'Sign In'}
               </Link>
            </div>

            <button
               ref={menuButton}
               type="button"
               className={`${style.menuButton} text-orange-200`}
               aria-label={menuOpen ? 'Close secondary menu' : 'Open secondary menu'}
               aria-expanded={menuOpen}
               aria-controls="header-navigation"
               onClick={() => setMenuOpen((open) => !open)}
            >
               {menuOpen ? <MdClose aria-hidden="true" /> : <MdMenu aria-hidden="true" />}
            </button>

            <div className={`${style.mobileNavWrap} ${navCollapsed ? style.collapsed : ''}`} inert={navCollapsed ? true : undefined} aria-hidden={navCollapsed ? 'true' : undefined}>
               <nav aria-label="Main navigation" className={style.mobileNav}>
                  {mainLinks.map(({ href, mobileText, MobileIcon }) => (
                     <Link
                        key={href}
                        href={href}
                        aria-current={isActive(pathname, href) ? 'page' : undefined}
                        className={`${style.mobileNavLink} ${isActive(pathname, href) ? style.mobileActive : ''}`}
                        onClick={() => setMenuOpen(false)}
                     >
                        <MobileIcon aria-hidden="true" focusable="false" />
                        <span>{mobileText}</span>
                     </Link>
                  ))}
               </nav>
            </div>

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

               <div className={style.utilities} data-header-utilities>
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
                              onClick={() => setIsUser(false)}
                           >
                              <RiLogoutCircleRLine aria-hidden="true" focusable="false" />
                              <span>Logout</span>
                           </button>
                        </form>
                     ) : (
                        <HeaderLink href="/login" text="Sign In" Icon={IoMdLogIn} color="text-orange-200" pathname={pathname} onNavigate={() => setMenuOpen(false)} />
                     )}
                  </div>
               </div>
            </div>
            <span ref={activeIndicator} className={style.activeIndicator} aria-hidden="true" />
         </header>
      </div>
   );
}
