import { Customer } from "../models/customer.model"

export const readCustomers = (filter) => Customer.find(filter)
export const readCustomerById = (id) => Customer.findById(id)
export const createCustomer = (data) => Customer.create(data)
export const readCustomer = (filter) => Customer.findOne(filter)