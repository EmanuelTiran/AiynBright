import { connectToMongo } from '@/server/connectToMongo';
import { updateUserByFieldService } from '@/server/BL/services/user.service';

export default async function handler(req, res) {
    console.log('Handler called with method:', req.method);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST method is allowed' });
    }

    await connectToMongo();

    console.log('Full request body:', req.body);

    const { filter: { email }, updateData } = req.body;

    console.log('Email:', email);
    console.log('UpdateData:', JSON.stringify(updateData, null, 2));

    if (email === undefined || email === null || email === '') {
        return res.status(406).json({ message: 'Email is required and cannot be empty' });
    }

    if (updateData === undefined || updateData === null || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'Update data is required and cannot be empty' });
    }

    if (updateData.colorWeaknesses && Array.isArray(updateData.colorWeaknesses)) {
        console.log('Color Weakness:', updateData.colorWeaknesses[0]);
    }

    try {
        const result = await updateUserByFieldService({email}, updateData);
        res.status(200).json({ message: 'User updated successfully', result });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

