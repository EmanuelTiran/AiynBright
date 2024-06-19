// "use server"
import style from "./style.module.css"
import OrderForm from "../OrderForm";
import CartDetails from "../CartDetails";
import { cookies } from "next/headers";
import { readProductsService } from "@/server/BL/services/product.service";

export default async function Checkout() {
    const cart = getCartProductsForCheckout();
    const ids = cart.map(product => product.productId)
    const detailsCarpets = await readProductsService({ _id: { $in: ids } })
    const totalCost = calculateTotalPrice(detailsCarpets, cart);
// הכנת מערך מוצרים עבור הזמנה
function getCartProductsForCheckout() {
    const cartData = cookies().get('cart');
    // console.log(cartData.value);
    // const cartData2 = localStorage.getItem('cart');
    if (!cartData || !('value' in cartData) || !cartData.value)  {
        return [];
    }
    const parsedCart = JSON.parse(cartData.value);
    // const parsedCart = cartData.value;
    const products = [];

    for (const productId in parsedCart) {
        const quantity = parsedCart[productId].quantity;

        products.push({
            productId: productId, // Assuming product IDs are valid ObjectIds
            quantity,
        });
    }
    return products;
}
// חישוב מחיר עסקה כולל
function calculateTotalPrice(catalog, cart) {
    let totalPrice = 0;
    for (const cartItem of cart) {
        const { productId, quantity } = cartItem;
        const product = catalog.find(p => p.id === productId);
        console.log(product.toObject());
        console.log(totalPrice);
        if (product) {
            const itemTotal = product.price * quantity;
            console.log(product.price);
            totalPrice += itemTotal;
            console.log(totalPrice);
        } else {
            console.log(`Product with ID ${productId} not found in catalog.`);
        }
    }
    console.log(totalPrice);
    return totalPrice;
}
    return (
        <>
            <OrderForm cart={cart} totalCost={totalCost} />
            <CartDetails  detailsCarpets={detailsCarpets} />
        </>
    )
}



