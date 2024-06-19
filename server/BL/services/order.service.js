import { createOrder, readOrderById, readOrders, readOrder } from "@/server/DL/controllers/order.controller";
import { updateProduct, readProductById } from "@/server/DL/controllers/product.controller";


export const createOrderService = async (data) => {
    console.log({data});
    data.products.forEach(async product => {
        console.log({product}, "😁😀🤔🤩🤗🙂☺😚😙");
        const requestedProduct = await readProductById(product.productId);
        if (!requestedProduct._id || requestedProduct.inStock < product.quantity) {
            throw "not enough in stock---------------------------------------------------------------------------"
        }
    })
    const newOrder = await createOrder(data);
    console.log(newOrder)

    if (newOrder._id) {
        console.log("🥵😱😰🥵🥵🥵🥵😱🥵🥵🥵😱😱🥵");
        data.products.forEach(async product => {
            const updatedProduct = await readProductById(product.productId);
            if (updatedProduct._id) {
                console.log(updatedProduct._id, "😍😎😋😊😉");
                updatedProduct.inStock -= product.quantity
                await updatedProduct.save();
            }
        })
    }
    return newOrder;
}
export const readOrdersService = (filter) => readOrders(filter)
export const readOrderByIdService = (id) => readOrderById(id)
export const readOrderByFieldService = (filter) => readOrder(filter)