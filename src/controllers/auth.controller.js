import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function login(req, res, next) {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }

    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive,
    };
    const token = jwt.sign(userData, secret, { expiresIn: '1h' });

    return res.status(200).json({ token, user: userData });
  } catch (error) {
    return next(error);
  }
}