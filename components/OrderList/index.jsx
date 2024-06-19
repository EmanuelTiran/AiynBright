import { readOrdersService } from '@/server/BL/services/order.service';
import { connectToMongo } from '@/server/connectToMongo';
import React from 'react'
import style from "./style.module.css"
import Image from 'next/image';
import Link from 'next/link';
export default async function OrderList() {
    // unstable_noStore()
    await connectToMongo()
    const orderList = await readOrdersService({ status: "pending" });
    console.log({ ...orderList[0] }, '😎😋😊😉');


    return (
        <div className={style.container} >
            <h1 className=''>Orders in pending status</h1>
            {orderList && orderList.map((order, i) => (
                <span key={order.id} className='flex items-start justify-between border m-2 p-4'> <div>

                    <h2 className=''>
                        <span className=' font-extrabold'>Order id:</span > {order.id} </h2>
                    <h2 className='font-extrabold text-lg'>
                        <span className=' font-extrabold'>Total:</span > {order.total} </h2>
                    <h3 className=''>
                        <span className=' font-extrabold'>Customer name:</span> {order.customerId.name || " אלון לוי "} </h3>
                    <h3 className=''>
                        <span className=' font-extrabold'>Email:</span > {order.customerId.email || "abc@gmail.com"} </h3>
                    <h3 className=''>
                        <span className=' font-extrabold'>Phone:</span > {order.customerId.phone || "0987654678"} </h3>
                    <h3 className=''>
                        <span className=' font-extrabold'>address:</span > {order.shippingAddress.street + " " + order.shippingAddress.houseNumber + " " + order.shippingAddress.city || "0987654678"} </h3>



                </div>
                    <span className=''>{order.products.map((product) => {
                        return <span className='flex  justify-center items-center border m-2 flex-col'>
                            <Link href={`/${product.productId.slug}`} >
                                <Image src={product.productId.images[0]} alt={product.productId.name} width={100} height={40} className={style.img} />
                            </Link>
                            <h2>{product.productId.name || "שטיח פרסי - תיאור"}</h2>
                        </span>
                    })}
                    </span>
                </span>
            ))}
        </div>
    )
}