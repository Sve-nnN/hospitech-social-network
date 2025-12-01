/**
 * @fileoverview Authentication controller handling user registration, login, and token management
 * @author Juan Carlos Angulo
 * @module auth.controller
 */

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Session from "../models/Session.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

/**
 * Registers a new user and creates a session
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Username
 * @param {string} req.body.email - Email address
 * @param {string} req.body.password - Plain text password
 * @param {string} [req.body.nombre] - First name (optional)
 * @param {string} [req.body.apellido] - Last name (optional)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const register = async (req, res, next) => {
  try {
    console.log("HEADERS /register:", req.headers);
    console.log("BODY /register:", req.body);
    let { username, email, nombre, apellido, password } = req.body;
    
    if (!nombre) nombre = "Nombre";
    if (!apellido) apellido = "Apellido";
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    
    try {
      const user = await User.create({
        username,
        email,
        nombre,
        apellido,
        password: hashed,
      });

      const payload = { sub: user._id.toString(), email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const refreshTokenHash = hashToken(refreshToken);

      await Session.create({
        user: user._id,
        refreshTokenHash,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          imagen_perfil_url: user.imagen_perfil_url,
        },
      });
    } catch (err) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({ msg: `${field} already exists` });
      }
      throw err;
    }
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

/**
 * Authenticates a user and creates a session
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Username or email
 * @param {string} req.body.password - Plain text password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const login = async (req, res, next) => {
  try {
    console.log("HEADERS /login:", req.headers);
    console.log("BODY /login:", req.body);
    const { username, password } = req.body;

    // Include password explicitly because the schema marks it with `select: false`
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const refreshTokenHash = hashToken(refreshToken);

    await Session.create({
      user: user._id,
      refreshTokenHash,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        imagen_perfil_url: user.imagen_perfil_url,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

/**
 * Refreshes access token using refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "No refresh token" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashToken(refreshToken);

    const session = await Session.findOne({ refreshTokenHash });
    if (!session) {
      return res.status(401).json({ msg: "Invalid session" });
    }

    const user = await User.findById(session.user);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const newAccessToken = generateAccessToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    next(error);
  }
};

/**
 * Logs out user by deleting the session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const refreshTokenHash = hashToken(refreshToken);
      await Session.deleteOne({ refreshTokenHash });
    }

    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.json({ msg: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    next(error);
  }
};
