const { sign } = require("jsonwebtoken");

const generateToken = (staff) => {
  return sign(staff, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = generateToken;
