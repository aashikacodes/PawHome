// Middleware = a function that runs BEFORE the route code.
// These ones check the login token (JWT) and the user role.
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Checks that the user is logged in
const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next(); // everything is fine, go to the route
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token, please login again" });
  }
};

// Only shelters can pass
const shelterOnly = (req, res, next) => {
  if (req.user.role !== "shelter") {
    return res.status(403).json({ message: "Only shelters can do this" });
  }
  next();
};

// Only adopters can pass
const adopterOnly = (req, res, next) => {
  if (req.user.role !== "adopter") {
    return res.status(403).json({ message: "Only adopters can do this" });
  }
  next();
};

module.exports = { protect, shelterOnly, adopterOnly };
