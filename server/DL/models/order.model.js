// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
//   total: { type: Number, required: true },
//   products: [{
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       quantity: { type: Number, required: true }
//     }],
//   shippingAddress: {
//     street: { type: String, required: true },
//     houseNumber: { type: Number, required: true },
//     city: { type: String, required: true },
//     state: { type: String }, 
//     zipCode: { type: String },
//     // zipCode: { type: String, required: true, validate: { validator: isPostalCode, message: 'Invalid ZIP code format' } }, // Add ZIP code validation
//   },
//   Notes: { type: String },
//   isItPaid: { type: Boolean, default: false },
//   status: { type: String, default: 'pending' },
//   orderDate: { type: Date, default: Date.now },
// });


// export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);


// // Custom ZIP code validation (example):
// function isPostalCode(value) {
//   // Implement your ZIP code format validation logic here
//   return /^[0-9]{5}$/.test(value); // Example for 5-digit US ZIP code
// }


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  total: { type: Number, required: true },
  products: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }],
  shippingAddress: {
    street: { type: String, required: true },
    houseNumber: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String },
    // zipCode: { type: String, required: true, validate: { validator: isPostalCode, message: 'Invalid ZIP code format' } }, // Add ZIP code validation
  },
  Notes: { type: String },
  isItPaid: { type: Boolean, default: false },
  status: { type: String, default: 'pending' },
  orderDate: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);