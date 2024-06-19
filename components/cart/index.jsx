import React, { useContext } from 'react';
import CartList from '../cartList';
import Total from '../total';
import style from '../style/style.module.css'
import DataContext from '../context/DataContext';

export default function Cart() {

  const { cartList, setCartList} = useContext(DataContext);

console.log(cartList);

  const handleDeleteAll = () => {
    setCartList({})
};


  return (


    <div className={style.cart}>
      <div className={style.cart2}>
        <h1>Cart</h1>
        <span style={{fontSize: "40px"}}>🛒 <span>{Object.keys(cartList).length}</span></span>
        <button onClick={handleDeleteAll}>Delete all</button>
        <Total />
      </div>
      <CartList />
    </div>


  )
}



