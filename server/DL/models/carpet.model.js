import mongoose from "mongoose";

const carpetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    material: String,
    size: String,
    color: String,
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    description: String,
    image: [{ type: String }]
});

export const Carpet = mongoose.models.Carpet || mongoose.model('Carpet', carpetSchema);


