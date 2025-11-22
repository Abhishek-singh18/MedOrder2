// routes/medicineRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMedicines,
  createMedicine,
} = require("/controllers/medicineController");
// const { protect, seller } = require('../middleware/authMiddleware'); // (Only needed for POST/PUT/DELETE)

// GET /api/medicines is the public route for the catalog
router.route("/").get(getMedicines);

// Example of the protected route:
// router.route('/').post(protect, seller, createMedicine);

module.exports = router;
