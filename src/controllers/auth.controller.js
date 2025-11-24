import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export const register = async (req, res, next) => {
  try {
    const { username, email, nombre, apellido, password } = req.body;
    const hashed = password ? await new Promise((res, rej) => bcrypt.hash(password, 10, (err, h) => err ? rej(err) : res(h))) : undefined;
    const user = await User.create({ username, email, nombre, apellido, password: hashed });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  const query = email ? { email } : { username };
  const user = await User.findOne(query).select('+password');
  if (!user) return res.status(401).json({ msg: 'Credenciales inválidas' });

  const ok = password && user.password ? await new Promise((res, rej) => bcrypt.compare(password, user.password, (err, ok) => err ? rej(err) : res(ok))) : false;
  if (!ok) return res.status(401).json({ msg: 'Credenciales inválidas' });

  const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.json({ token });
};

export default { register, login };
