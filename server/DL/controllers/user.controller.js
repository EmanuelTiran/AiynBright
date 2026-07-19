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

export const deleteColorWeaknessAtIndex = async (email, field, index) => {
    try {
       // Find the user by email using the custom static method
       console.log("*******************************8")
       const user = await User.findOne({email});

        // Check if the user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Check if the index is within the array bounds
        if (index < 0 || (field === 'color' && index >= user.colorWeaknesses.length) || (field === 'size' && index >= user.sizeWeaknesses.length)) {
            throw new Error('Invalid index');
        }
        field === 'color' && user.colorWeaknesses.splice(index, 1);
        field === 'size' && user.sizeWeaknesses.splice(index, 1);

        // Save the updated user
        await user.save();

        return { message: 'Color weakness deleted successfully' };
    } catch (error) {
        return { error: error.message };
    }
};

