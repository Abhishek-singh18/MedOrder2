// controllers/medicineController.js

const Medicine = require("/models/Medicine");

// @desc    Get all medicines (for Customer browsing)
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res) => {
  // Basic search functionality for the Medicine List page
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i", // Case-insensitive
        },
      }
    : {};

  const medicines = await Medicine.find({ ...keyword })
    .populate("seller", "name email")
    .exec(); // <--- ADDED .exec() for explicit execution and safety
  res.json(medicines);
};

// @desc    Create a new medicine (Seller only)
// @route   POST /api/medicines
// @access  Private/Seller
const createMedicine = async (req, res) => {
  const { name, description, price, stockQuantity, category, imageUrl } =
    req.body;

  // The req.user is set by the 'protect' middleware
  const medicine = new Medicine({
    name,
    description,
    price,
    stockQuantity,
    category,
    imageUrl,
    seller: req.user._id, // Assigns the currently logged-in Seller as the creator
  });

  try {
    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid medicine data", error: error.message });
  }
};

// @desc    Update a medicine (Seller only, must own the medicine)
// @route   PUT /api/medicines/:id
// @access  Private/Seller
const updateMedicine = async (req, res) => {
  const { name, description, price, stockQuantity, category, imageUrl } =
    req.body;
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    // Check if the logged-in user is the owner of the medicine
    if (medicine.seller.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this medicine" });
    }

    medicine.name = name || medicine.name;
    medicine.description = description || medicine.description;
    medicine.price = price || medicine.price;
    medicine.stockQuantity = stockQuantity || medicine.stockQuantity;
    medicine.category = category || medicine.category;
    medicine.imageUrl = imageUrl || medicine.imageUrl;

    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } else {
    res.status(404).json({ message: "Medicine not found" });
  }
};

// @desc    Delete a medicine (Seller only, must own the medicine)
// @route   DELETE /api/medicines/:id
// @access  Private/Seller
const deleteMedicine = async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    // Check ownership before deleting
    if (medicine.seller.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this medicine" });
    }

    await Medicine.deleteOne({ _id: req.params.id });
    res.json({ message: "Medicine removed" });
  } else {
    res.status(404).json({ message: "Medicine not found" });
  }
};

module.exports = {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
