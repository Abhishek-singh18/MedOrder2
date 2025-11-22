// models/Order.js

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Links to the customer who placed the order
    },
    orderItems: [
      // Array of items purchased
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Medicine", // Links to the specific medicine product
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User", // Links to the wholesaler (seller)
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Credit Card", // For payment gateway simulation
    },
    paymentResult: {
      // Details from the payment gateway (e.g., Stripe)
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 5.0 }, // Fixed $5 delivery fee
    taxPrice: { type: Number, required: true, default: 0.0 },
    totalAmount: { type: Number, required: true, default: 0.0 },

    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },

    // --- Delivery Tracking Fields ---
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },

    deliveryStatus: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Processing",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the assigned Rider (Delivery Partner)
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
