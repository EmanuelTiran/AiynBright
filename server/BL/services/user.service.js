import { createUser, readUserById, readUsers, readUser, updateUser,deleteColorWeaknessAtIndex } from "@/server/DL/controllers/user.controller";


export const createUserService = (data) => createUser(data)
export const readUsersService = (filter) => readUsers(filter)
export const readUserByIdService = (id) => readUserById(id)
export const readUserByFieldService = (filter) => readUser(filter)
export const updateUserByFieldService = (filter, updateData) => updateUser(filter, updateData)
export const deleteUserByFieldService = (email, field, index) => {
    return deleteColorWeaknessAtIndex(email, field, index);
}