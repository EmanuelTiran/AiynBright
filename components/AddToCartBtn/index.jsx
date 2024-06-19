"use client"
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import Cookies  from 'js-cookie';

const AddToCartBtn = ({ productId }) => {
  const [mounted,setMounted] = useState(false)
  const initialCart = Cookies.get("cart");
  // console.log({initialCart});
  
  // const initialCart2 = localStorage.getItem('cart');
  const initialQuantity = initialCart && JSON.parse(initialCart)[productId]?.quantity ||0;
  const [quantity, setQuantity] = useState(initialCart && JSON.parse(initialCart)[productId]?.quantity ||0);
  
  useEffect(()=>{
    setMounted(true)
  },[])


  useEffect(() => {
    const cart = Cookies.get("cart");
    let parsedCart;
    if (cart) {
      parsedCart = JSON.parse(cart);
    } else {
      parsedCart = {}; // Initialize an empty cart object
    }
    if (quantity > 0) {
      parsedCart[productId] = { quantity };
    } else {
      // Remove the product from the cart if quantity is 0
      delete parsedCart[productId];
    }
    // localStorage.setItem('cart', JSON.stringify(parsedCart));
    // document.cookie =`cart=${JSON.stringify(parsedCart)}`;
    Cookies.set('cart',JSON.stringify(parsedCart));


  }, [quantity, productId]);

  if (!mounted) return     <div className={style.container1}>
  <span className={style.container2}>
    <button className={style.button} disabled onClick={() => setQuantity(quantity + 1)}>+</button>
     <span >0</span>
    <button className={style.button} onClick={() => setQuantity(quantity - 1)} disabled>-</button>
  </span>
  <span className={style.container2}>
    <button className={style.button} disabled onClick={() => setQuantity(0)}>Remove</button>
    <button className={style.button} disabled onClick={() => setQuantity(quantity + 1)}>Add</button>
  </span>
</div>

  return (
    <div className={style.container1}>
      <span className={style.container2}>
        <button className={style.button} onClick={() => setQuantity(quantity + 1)}>+</button>
         <span >{quantity}</span>
        <button className={style.button} onClick={() => setQuantity(quantity - 1)} disabled={quantity === 0}>-</button>
      </span>
      <span className={style.container2}>
        <button className={style.button} onClick={() => setQuantity(0)}>Remove</button>
        <button className={style.button} onClick={() => setQuantity(quantity + 1)}>Add</button>
      </span>
    </div>
  );
};

export default AddToCartBtn;
