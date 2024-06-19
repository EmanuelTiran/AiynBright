"use client"
import React, { useState, useEffect } from 'react';
import style from './style.module.css'
import { FaRug } from "react-icons/fa6";
import { SiReactquery } from "react-icons/si";
import Link from 'next/link'

export default function Icon({ carpet }) {

    return (

        <div className={style.icon}>
            <Link href={`/`}>
                <FaRug />
                <SiReactquery className={style.star} />
            </Link>
        </div>



    )
}
