// utils/generateToken.js (Create this new file)

const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // Payload: User ID and Role
    process.env.JWT_SECRET,
    { expiresIn: "30d" } // Token expires in 30 days
  );
};

module.exports = generateToken;
// utils/generateToken.js (Create this new file)

const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // Payload: User ID and Role
    process.env.JWT_SECRET,
    { expiresIn: "30d" } // Token expires in 30 days
  );
};

module.exports = generateToken;
