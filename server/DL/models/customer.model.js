import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: '123' },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Please enter exactly 10 digits.`,
        },
        required: true
    },
    address: {
        street: { type: String, required: true },
        houseNumber: { type: Number, required: true },
        city: { type: String, required: true },
        state: { type: String },
        zipCode: { type: String },
    },
    registeredAt: { type: Date, default: Date.now },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
