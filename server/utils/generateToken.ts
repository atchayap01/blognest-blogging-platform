import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'blognest_default_jwt_secret_dev_2026';

export const generateToken = (userId: mongoose.Types.ObjectId | string, role: string = 'user'): string => {
  return jwt.sign(
    { id: userId.toString(), role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): { id: string; role: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
};
