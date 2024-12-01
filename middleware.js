const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  try {
    const info = req.headers.authorization;
    if (!info || !info.startsWith("Bearer ")) {
      return res.status(500).json({ message: "Invalid authentication format" });
    }
    const infoBreak = info.split(" ");
    const token = infoBreak[1];

    const decoded = await jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    }
  } catch (e) {
    return res.status(403).json({ message: "Invalid authentication token", e });
  }
}

module.exports = {
  authMiddleware,
};
