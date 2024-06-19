import { Customer } from "../models/customer.model";
import { Order } from "../models/order.model"

// export const readOrders = (filter) => Order.find(filter)

export async function readOrders(filter, isPopulate = true) {
    const orders = await Order.find(filter).populate(
        isPopulate ? ['products', { path: 'products.productId', }] : null);

    if (isPopulate) {
        for (let order of orders) {
            order.customerId = await Customer.findById(order.customerId).select('name email phone address');
        }
    }

    return orders;
}
export async function readOrders1(filter, isPopulate) {
    return await Order.find(filter).populate(
        isPopulate ? ['products', { path: 'products.productId', }] : null)
}

// export async function readOrders(filter, isPopulate = true) {
//     let query = Order.find(filter);
//     if (isPopulate) {
//         query = query.populate({
//             path: 'customerId',
//             select: 'name email phone address'
//         });
//     }
//     return await query.exec();
// }


export const readOrderById = (id) => Order.findById(id)
export const createOrder = async (data) => {
    console.log(data);
    const order = await Order.create(data)
    console.log(order);
    return order


}

export const readOrder = (filter) => Order.findOne(filter)
