const { verify } = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    if (!token) {
      return res.status(401).json({
        message: "You need to be logged in to perform this action.",
      });
    }

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "You are not authorized. Token is invalid." });
      }
      const { staff } = decoded;
      req.user = staff;
      next();
    });
  } catch {
    ({ message }) => {
      res.status(500).json({ msg: message });
    };
  }
};

module.exports = verifyToken;
