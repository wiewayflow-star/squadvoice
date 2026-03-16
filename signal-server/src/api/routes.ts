import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db';
import { hashPassword, verifyPassword, generateToken, checkNicknameAvailable } from '../auth/auth';

const router = Router();

// Check nickname availability
router.get('/check-nickname/:nickname', (req, res) => {
  try {
    const available = checkNicknameAvailable(req.params.nickname);
    res.json({ available });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { nickname, password, publicKey, displayName, avatarHash } = req.body;
    if (!nickname || !password || !publicKey || !displayName)
      return res.status(400).json({ error: 'Missing required fields' });

    if (!checkNicknameAvailable(nickname))
      return res.status(409).json({ error: 'Nickname already taken' });

    const passwordHash = await hashPassword(password);
    const id = uuidv4();

    db.prepare(
      'INSERT INTO users (id, nickname, password_hash, public_key, display_name, avatar_hash) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, nickname, passwordHash, publicKey, displayName, avatarHash || null);

    const user = db.prepare('SELECT id, nickname, display_name, created_at FROM users WHERE id = ?').get(id) as any;
    const token = generateToken(user.id, user.nickname);

    res.status(201).json({
      user: { id: user.id, nickname: user.nickname, displayName: user.display_name, createdAt: user.created_at },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    if (!nickname || !password)
      return res.status(400).json({ error: 'Missing credentials' });

    const user = db.prepare(
      'SELECT id, nickname, password_hash, display_name, avatar_hash FROM users WHERE nickname = ?'
    ).get(nickname) as any;

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id, user.nickname);
    res.json({
      user: { id: user.id, nickname: user.nickname, displayName: user.display_name, avatarHash: user.avatar_hash },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 1: Client requests link — generates 6-digit code
router.post('/telegram/request-link', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    db.prepare(`
      INSERT INTO telegram_links (user_id, verification_code, verified)
      VALUES (?, ?, 0)
      ON CONFLICT(user_id) DO UPDATE SET verification_code = excluded.verification_code, telegram_id = NULL, verified = 0
    `).run(userId, code);

    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 2: Bot calls this after user opens it — saves telegram_id, returns code to send
router.post('/telegram/save-telegram-id', (req, res) => {
  try {
    const { userId, telegramId } = req.body;
    if (!userId || !telegramId) return res.status(400).json({ error: 'Missing fields' });

    const link = db.prepare('SELECT * FROM telegram_links WHERE user_id = ?').get(userId) as any;
    if (!link) return res.status(404).json({ error: 'No pending link for this user' });

    db.prepare('UPDATE telegram_links SET telegram_id = ? WHERE user_id = ?').run(telegramId, userId);

    res.json({ code: link.verification_code });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 3: Client submits code entered by user
router.post('/telegram/confirm-code', (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) return res.status(400).json({ error: 'Missing fields' });

    const link = db.prepare(
      'SELECT * FROM telegram_links WHERE user_id = ? AND verification_code = ?'
    ).get(userId, code) as any;

    if (!link) return res.status(400).json({ error: 'Invalid code' });
    if (!link.telegram_id) return res.status(400).json({ error: 'Open the bot in Telegram first' });

    db.prepare('UPDATE telegram_links SET verified = 1 WHERE user_id = ?').run(userId);
    db.prepare('UPDATE users SET telegram_id = ? WHERE id = ?').run(link.telegram_id, userId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
