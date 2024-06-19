"use client"
import Link from 'next/link'
import style from './style.module.css'
import { usePathname } from 'next/navigation'
import React from 'react'
 
export default function Navlink({ children, href }) {
   const path = usePathname()

   return (
      <Link
         href={href}
         // style={{ color: path === href ? '#f7aa05' : '#9da1a2' }}
         className={path === href ? style.current : style.notCurrent}
         >{children}</Link>
   )
}
