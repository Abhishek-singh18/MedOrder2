// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("/models/User");

const protect = async (req, res, next) => {
  let token;

  // Check for token in the 'Authorization' header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Format: 'Bearer <token>')
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (minus password) to the request object
      req.user = await User.findById(decoded.id).select("-password");
      req.role = decoded.role; // Attach role for role-based authorization

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware for role-based authorization (e.g., only sellers can add medicines)
const seller = (req, res, next) => {
  if (req.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a seller" });
  }
};

// You can add 'rider' and 'admin' middleware here too

module.exports = { protect, seller };
