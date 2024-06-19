"use server"

import { connectToMongo } from "@/server/connectToMongo"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createCustomerService } from "../services/customer.service"
import { readCustomerByFieldService } from "../services/customer.service"
import { readCustomer } from "@/server/DL/controllers/customer.controller"
import { createOrderService } from "../services/order.service"
import { cookies } from "next/headers";


export const createOrderAction = async (fd) => {
    const body = Object.fromEntries(fd)
    const products = JSON.parse(body.products);
    console.log(products);
    try {
        await connectToMongo()
        let customer = await readCustomerByFieldService({ email: body.email });
        // console.log(customer.toObject());
        if (!customer?.id) {
            // console.log(customer.id);
            const newCustomer = {
                name: body.name,
                email: body.email,
                phone: body.phone,
                address: {
                    street: body.street,
                    houseNumber: body.houseNumber,
                    city: body.city,
                    state: body.state,
                    zipCode: body.zipCode,
                }
            }
            customer = await createCustomerService(newCustomer);
            // console.log(customer);
        }
        const order = {
            customerId: customer.id,
            // products: { productId: body.productId, quantity: body.quantity },
            products,
            total: body.total,
            shippingAddress: customer.address.toObject(),
            Notes: body.notes,
        }
        const newOrder = await createOrderService(order);
        if (newOrder.id) {
            console.log(newOrder.id)
            customer.orders.push(newOrder.id);
            customer.save()
            cookies().delete('cart')
        }
        revalidatePath('/')
    } catch (error) {
        console.log({ error })
    }
    // redirect('/')
} 