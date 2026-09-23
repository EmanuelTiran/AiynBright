import React from 'react';
import style from './style.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" title="AyinBright home" className={style.logo}>
      <span className={style.mark} aria-hidden="true">
        <Image
          className={style.logoIcon}
          src="/favicon.ico"
          alt=""
          width={50}
          height={50}
          priority
        />
      </span>
      <span className={style.identity}>
        <span className={style.wordmark}>
          <strong>Ayin</strong><span>Bright</span>
        </span>
        <span className={style.tagline}>See a brighter you</span>
      </span>
    </Link>
  );
}
