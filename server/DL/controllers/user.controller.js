import { User } from "../models/user.model"

export const readUsers = (filter) => User.find(filter)
export const readUserById = (id) => User.findById(id)
export const createUser = (data) => User.create(data)
export const readUser = (filter) => User.findOne(filter)
export const updateUser = async (filter, updateData) => {
    try {
        const result = await User.findOneAndUpdate(filter, updateData, { new: true });
        if (!result) {
            throw new Error('User not found');
        }
        return result;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

