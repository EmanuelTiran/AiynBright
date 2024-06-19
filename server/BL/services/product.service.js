import { createProduct, readProductById, readProducts ,readProduct,updateProduct} from "@/server/DL/controllers/product.controller";


export const createProductService = (data) => createProduct(data)
export const readProductsService = (filter) => readProducts(filter)
export const readProductByIdService = (id) => readProductById(id)
export const readProductByFieldService = (filter) => readProduct(filter)
export const updateProductByFieldService = (id, data) => updateProduct(id, data)