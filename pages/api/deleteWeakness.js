// pages/api/deleteWeakness.js

import { deleteUserByFieldService } from "@/server/BL/services/user.service";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, field, index } = req.body;

        try {
            const response = await deleteUserByFieldService(email, field, index);
            if (response.error) {
                res.status(400).json({ error: response.error });
                return;
            }
            res.status(200).json({ message: 'Weakness deleted successfully', user: response.user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}