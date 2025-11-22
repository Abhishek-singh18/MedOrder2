// controllers/orderController.js

const Order = require("/models/Order");
const Medicine = require("/models/Medicine");
const User = require("/models/User"); // Used to potentially find Riders

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer only)
const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalAmount,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // 1. Check stock for each item before creating the order
    for (const item of orderItems) {
      const medicine = await Medicine.findById(item.medicine);
      if (!medicine || medicine.stockQuantity < item.qty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    // 2. Create the Order object
    const order = new Order({
      customer: req.user._id, // Set by the 'protect' middleware
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalAmount,
      // Delivery status starts as 'Pending'
    });

    const createdOrder = await order.save();

    // 3. IMPORTANT: Update stock quantity after successful order creation
    for (const item of orderItems) {
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: { stockQuantity: -item.qty },
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Order creation failed", error: error.message });
  }
};

// ... in controllers/orderController.js

// @desc    Get order by ID (for Delivery Tracking)
// @route   GET /api/orders/:id
// @access  Private (Customer/Seller/Rider - depends on logic)
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('customer', 'name email phone') // Get customer info
        .populate('rider', 'name phone'); // Get rider info

    if (order) {
        // PRODUCTION NOTE: Add logic here to ensure only the customer, seller, or rider of the order can view it.
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user's orders (Order History)
// @route   GET /api/orders/myorders
// @access  Private (Customer only)
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ customer: req.user._id });
    res.json(orders);
};

// ... in controllers/orderController.js

// @desc    Update order to Paid (Simulate Payment Gateway success)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        
        // Simulating the result data received from a payment provider
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status || 'SUCCESS',
            update_time: Date.now().toISOString(),
            email_address: req.user.email,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// This is where rider logic and 'Out For Delivery' status changes would be handled by a Seller/Admin/Rider
// const updateOrderToDelivered = async (req, res) => { ... };

// controllers/orderController.js (Add these functions)

// @desc    Get orders for a specific Seller (Wholesaler)
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
    // Finds orders where any item in the orderItems array belongs to the logged-in seller
    const orders = await Order.find({ 
        'orderItems.seller': req.user._id 
    })
    .populate('customer', 'name phone address')
    .sort({ createdAt: -1 }); // Show newest orders first
    
    // NOTE: In a real multi-seller app, you'd filter the orderItems array for *only* the seller's items.
    res.json(orders);
};

// @desc    Assign a rider to a specific order (Admin/Seller function)
// @route   PUT /api/orders/:id/assign
// @access  Private/Seller (or Admin)
const assignRider = async (req, res) => {
    const { riderId } = req.body;
    
    // Check if the riderId is a valid user and has the 'rider' role (Not fully implemented here for brevity)
    
    const order = await Order.findById(req.params.id);

    if (order) {
        order.rider = riderId;
        order.deliveryStatus = 'Processing'; // Move status forward upon assignment
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update delivery status (Used by Rider/Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Rider (or Admin)
const updateDeliveryStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        // Simple security check: Rider can only update status if assigned
        // if (order.rider.toString() !== req.user._id.toString()) {
        //     return res.status(401).json({ message: 'Not authorized to update this order' });
        // }
        
        order.deliveryStatus = status; 
        
        if (status === 'Out For Delivery') {
            // Log the delivery start time for 30 min tracking
            // NOTE: You would calculate remaining delivery time on the frontend here.
        }
        
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = { 
    /* ... existing exports ... */ 
    getSellerOrders, 
    assignRider, 
    updateDeliveryStatus 
};