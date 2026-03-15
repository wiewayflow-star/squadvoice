import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db';
import { hashPassword, verifyPassword, generateToken, checkNicknameAvailable } from '../auth/auth';

const router = Router();

// Check nickname availability
router.get('/check-nickname/:nickname', (req, res) => {
  try {
    const { nickname } = req.params;
    const available = checkNicknameAvailable(nickname);
    res.json({ available });
  } catch (error) {
    console.error('Error checking nickname:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { nickname, password, publicKey, displayName, avatarHash } = req.body;

    if (!nickname || !password || !publicKey || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!checkNicknameAvailable(nickname)) {
      return res.status(409).json({ error: 'Nickname already taken' });
    }

    const passwordHash = await hashPassword(password);
    const id = uuidv4();

    db.prepare(`
      INSERT INTO users (id, nickname, password_hash, public_key, display_name, avatar_hash)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, nickname, passwordHash, publicKey, displayName, avatarHash || null);

    const user = db.prepare('SELECT id, nickname, display_name, created_at FROM users WHERE id = ?').get(id) as any;
    const token = generateToken(user.id, user.nickname);

    res.status(201).json({
      user: {
        id: user.id,
        nickname: user.nickname,
        displayName: user.display_name,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const user = db.prepare(
      'SELECT id, nickname, password_hash, display_name, avatar_hash FROM users WHERE nickname = ?'
    ).get(nickname) as any;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.nickname);

    res.json({
      user: {
        id: user.id,
        nickname: user.nickname,
        displayName: user.display_name,
        avatarHash: user.avatar_hash,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request Telegram linking code
router.post('/telegram/request-link', (req, res) => {
  try {
    const { userId } = req.body;
    const code = uuidv4().substring(0, 8);

    db.prepare(`
      INSERT INTO telegram_links (user_id, verification_code, verified)
      VALUES (?, ?, 0)
      ON CONFLICT(user_id) DO UPDATE SET verification_code = excluded.verification_code, verified = 0
    `).run(userId, code);

    res.json({ code });
  } catch (error) {
    console.error('Error requesting Telegram link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify Telegram link (called by bot)
router.post('/telegram/verify', (req, res) => {
  try {
    const { code, telegramId } = req.body;

    const link = db.prepare(
      'SELECT user_id FROM telegram_links WHERE verification_code = ?'
    ).get(code) as any;

    if (!link) {
      return res.status(404).json({ error: 'Invalid code' });
    }

    db.prepare(
      'UPDATE telegram_links SET telegram_id = ?, verified = 1 WHERE verification_code = ?'
    ).run(telegramId, code);

    db.prepare('UPDATE users SET telegram_id = ? WHERE id = ?').run(telegramId, link.user_id);

    res.json({ success: true, userId: link.user_id });
  } catch (error) {
    console.error('Error verifying Telegram link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
