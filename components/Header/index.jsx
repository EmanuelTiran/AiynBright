import React from 'react'
import Navlink from '../Navlink'
import style from './style.module.css'
import Icon from '../Icon'

import CartBadge from '../CartBadge'
import Logo from '../Logo'
const linksList = [
   { href: '/', text: 'Home' },
   { href: '/about', text: 'About' },
   { href: '/user', text: 'User Details' },
   { href: '/blur', text: 'Blur Vision' },
   { href: '/color', text: 'Color Vision' },
]

export default function Header() {

   return (
      <header className={style.header}>
         <span className={style.refs}>
            {linksList.map((link) => (
               <Navlink key={link.href} href={link.href}>
                  {link.text}
               </Navlink>
            ))}
            <Logo/>
         </span>
         <div className={style.lightning}></div>
      </header>
   )
}
