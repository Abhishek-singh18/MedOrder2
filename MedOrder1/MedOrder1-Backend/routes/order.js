// routes/order.js

const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Route to place a new order
router.route("/").post(protect, createOrder);

// Route for customer's order history
router.route("/myorders").get(protect, getMyOrders);

// Route for specific order details (used for tracking)
router.route("/:id").get(protect, getOrderById);

// Route for payment status update
router.route("/:id/pay").put(protect, updateOrderToPaid);

module.exports = router;

// routes/order.js (Add these routes)

const { seller, rider } = require('../middleware/authMiddleware'); 
// Assuming you've added the `rider` middleware (similar to `seller` but checks req.role === 'rider')

// Seller/Admin routes
router.route('/seller').get(protect, seller, getSellerOrders);
router.route('/:id/assign').put(protect, seller, assignRider); // Only Sellers can assign riders

// Rider/Admin routes
router.route('/:id/status').put(protect, updateDeliveryStatus); // We will secure this with `rider` middleware in a real app