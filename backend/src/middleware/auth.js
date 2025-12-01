/**
 * @fileoverview Authentication middleware for protecting routes
 * @author Juan Carlos Angulo
 * @module auth.middleware
 */

import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Middleware to verify JWT access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("[Backend Auth] Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[Backend Auth] Missing or invalid format");
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("[Backend Auth] Token verification failed:", error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
