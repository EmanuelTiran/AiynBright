import { createCustomer, readCustomerById, readCustomers ,readCustomer} from "@/server/DL/controllers/customer.controller";


export const createCustomerService = (data) => createCustomer(data)
export const readCustomersService = (filter) => readCustomers(filter)
export const readCustomerByIdService = (id) => readCustomerById(id)
export const readCustomerByFieldService = (filter) => readCustomer(filter)

