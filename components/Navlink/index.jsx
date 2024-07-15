"use client"
import Link from 'next/link'
import style from './style.module.css'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Navlink({ children, href ,colorText }) {
   const path = usePathname()

   return (
      <Link
         href={href}
         className={`${path === href ? style.current : " font-light"} ${colorText} ${style.myHover}`}
      >{children}</Link>
   )
}
