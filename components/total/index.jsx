
import React, { useContext, useState, useEffect } from 'react';
import  DataContext  from '../context/DataContext';


export default function Total() {
    const {cartList} = useContext(DataContext);
    const [total, setTotal] = useState(0);


     useEffect(() =>{
        setTotal(calculateTotalCost())
     } , [cartList])



    function calculateTotalCost() {
        let totalCost = 0;
        Object.values(cartList).map((item) => {
            totalCost += item.item.price * item.amount;
        });
        return parseFloat(totalCost.toFixed(2));
    }
  


  return (
    <h2>Total Cost: {parseFloat(total.toFixed(2))} </h2>
  )
}
