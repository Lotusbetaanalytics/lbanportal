const { sign } = require("jsonwebtoken");

const generateToken = (staff) => {
  return sign(staff, process.env.JWT_SECRET, { expiresIn: "1800s" });
};

module.exports = generateToken;
