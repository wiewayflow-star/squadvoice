import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';

const JWT_SECRET = process.env.JWT_SECRET || 'squadvoice-change-this-secret';
const SALT_ROUNDS = 12;

export interface AuthToken {
  userId: string;
  nickname: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, nickname: string): string {
  return jwt.sign({ userId, nickname }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch {
    return null;
  }
}

export function checkNicknameAvailable(nickname: string): boolean {
  const row = db.prepare('SELECT id FROM users WHERE nickname = ?').get(nickname);
  return row === undefined;
}
