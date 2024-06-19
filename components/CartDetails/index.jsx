import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import style from "./style.module.css"

export default async function CartDetails({ detailsCarpets }) {
  
  return (
    <div className={style.container}>
      {detailsCarpets.map((product) => (
          <span>
          <Link className={style.link} key={product._id} href={`/${product.slug}`} >
            <Image src={product.images[0]} alt={product.title} width={300} height={175} />
            <h1 className={style.name}> {product.name} </h1>
            {/* <p className={style.description}>
              {product.description}
            </p> */}
          </Link>
         </span>
        ))}
    </div>
  )
}
