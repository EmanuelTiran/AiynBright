import React from 'react'
import Navlink from '../Navlink'
import style from './style.module.css'
import Icon from '../Icon'

import CartBadge from '../CartBadge'
const linksList = [
   { href: '/', text: 'Home' },
   { href: '/about', text: 'About' },
   { href: '/mydetails', text: 'My Details' },
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
         </span>
         <div className={style.lightning}></div>
      </header>
   )
}
