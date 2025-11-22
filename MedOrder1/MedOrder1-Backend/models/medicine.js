// models/Medicine.js

const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Stock cannot be negative
    },
    imageUrl: {
      type: String,
      default: "/images/sample-medicine.jpg",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "pain_relief",
        "vitamins",
        "first_aid",
        "cold_flu",
        "prescription",
        "other",
      ],
      default: "other",
    },
    seller: {
      // Establishes a relationship with the User model
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Medicine = mongoose.model("Medicine", MedicineSchema);
module.exports = Medicine;
