import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Session from "../models/Session.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, nombre, apellido, password } = req.body;
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({
      username,
      email,
      nombre,
      apellido,
      password: hashed,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const query = email ? { email } : { username };
    const user = await User.findOne(query).select("+password");
    if (!user) return res.status(401).json({ msg: "Credenciales inválidas" });

    const ok =
      password && user.password
        ? await bcrypt.compare(password, user.password)
        : false;
    if (!ok) return res.status(401).json({ msg: "Credenciales inválidas" });

    // Dual token
    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const refreshTokenHash = hashToken(refreshToken);

    // Guardar sesión
    await Session.create({
      user: user._id,
      refreshTokenHash,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Setear refresh token en cookie segura
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};

// Endpoint para refresh
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ msg: "No refresh token" });
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ msg: "Refresh token inválido" });
    }
    const refreshTokenHash = hashToken(refreshToken);
    const session = await Session.findOne({
      user: payload.sub,
      refreshTokenHash,
    });
    if (!session)
      return res
        .status(401)
        .json({ msg: "Refresh token no válido o revocado" });

    // Rotar refresh token
    await session.deleteOne();
    const newRefreshToken = generateRefreshToken({
      sub: payload.sub,
      email: payload.email,
    });
    const newRefreshTokenHash = hashToken(newRefreshToken);
    await Session.create({
      user: payload.sub,
      refreshTokenHash: newRefreshTokenHash,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const accessToken = generateAccessToken({
      sub: payload.sub,
      email: payload.email,
    });
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export default { register, login };
