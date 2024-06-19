import { User } from "../models/user.model"

export const readUsers = (filter) => User.find(filter)
export const readUserById = (id) => User.findById(id)
export const createUser = (data) => User.create(data)
export const readUser = (filter) => User.findOne(filter)