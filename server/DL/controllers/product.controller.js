import { Product } from "../models/product.model"

export const readProducts = (filter) => Product.find(filter)
export const readProductById = (id) => Product.findById(id)
export const createProduct = (data) => Product.create(data)
export const readProduct = (filter) => Product.findOne(filter)
export const updateProduct = (id, data) => Product.findByIdAndUpdate(id, data)

async function update(id, data) {
    return await emailModel.findByIdAndUpdate(id, data, { new: true })
}