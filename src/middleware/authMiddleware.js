import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= PROTECT ROUTE ================= */
const protect = async (req, res, next) => {
  try {
    let token;

    //  Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //  No token
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Get full user from database (without password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    //  Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({
      message: "Not authorized",
    });
  }
};

/* ================= ADMIN ONLY ================= */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

export { protect, adminOnly };