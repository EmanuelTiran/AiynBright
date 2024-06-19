import { Carpet } from "../models/carpet.model"

export const readCarpets = (filter) => Carpet.find(filter)
export const readCarpetById = (id) => Carpet.findById(id)
export const createCarpet = (data) => Carpet.create(data)
export const readCarpet = (filter) => Carpet.findOne(filter)