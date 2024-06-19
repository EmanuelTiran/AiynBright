import React from 'react'
import style from "./style.module.css"
import { createOrderAction } from "@/server/BL/actions/order.action"

export default function OrderForm({ totalCost, cart }) {
    return (
        <div className={`${style.container} p-4 `}>

            <h1 className="text-2xl font-bold mb-4">New Order</h1>

            <div className="hidden">
                <label className="block text-sm font-medium text-gray-700">CustomerId</label>

                <input type="text" readOnly

                    name='customerId' value={'66509743c542c7a47f8ba955'} />
            </div>

            <form action={createOrderAction} className="space-y-4 ">
                <div className="hidden">
                    <label className="block text-sm font-medium text-gray-700">Products</label>

                    <input type="text" readOnly
                        name='products' value={JSON.stringify(cart)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total</label>
                    <input type="number" readOnly
                        name='total' value={totalCost} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full name</label>
                    <input
                        type="text"
                        name='name'
                        placeholder="Full name"
                        className={`mt-1 block w-full rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name='email'
                        placeholder="Email"
                        className={`mt-1 block w-full rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="number"
                        name='phone'
                        className={`mt-1 block w-full  rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Street</label>
                    <input
                        type="text"
                        name='street'
                        className={`mt-1 block w-full  rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">House number</label>
                    <input
                        type="number"
                        name='houseNumber'
                        className={`mt-1 block w-full  rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        name='city'
                        className={`mt-1 block w-full  rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                        type="text"
                        name='state'
                        className={`mt-1 block w-full  rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">zipCode</label>
                    <input
                        type="number"
                        name='zipCode'
                        className={`mt-1 block w-full  rounded-md shadow-sm`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        name='notes'
                        className={`mt-1 block w-full rounded-md shadow-sm`}
                    ></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        className={style.button}
                    >
                        Order
                    </button>
                </div>
            </form>
        </div>
    )
}
