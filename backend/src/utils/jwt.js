/**
 * @fileoverview JWT utility functions for token generation and verification
 * @author Juan Carlos Angulo
 * @module jwt.utils
 */

import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_fixed_2025_secure";
console.log('[Backend] JWT_SECRET prefix:', JWT_SECRET.substring(0, 3));
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRES = "24h";
const REFRESH_TOKEN_EXPIRES = "7d";

/**
 * Generates an access token
 * @param {Object} payload - Token payload
 * @param {string} payload.sub - User ID
 * @param {string} payload.email - User email
 * @returns {string} JWT access token
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
    algorithm: "HS256",
  });
}

/**
 * Generates a refresh token
 * @param {Object} payload - Token payload
 * @param {string} payload.sub - User ID
 * @param {string} payload.email - User email
 * @returns {string} JWT refresh token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
    algorithm: "HS256",
  });
}

/**
 * Verifies an access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Verifies a refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

/**
 * Hashes a token using SHA-256
 * @param {string} token - Token to hash
 * @returns {string} Hexadecimal hash of the token
 */
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
