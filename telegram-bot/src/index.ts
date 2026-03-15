import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SIGNAL_SERVER_URL = process.env.SIGNAL_SERVER_URL || 'http://localhost:8080';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('SquadVoice Telegram Bot started');

// Handle /start command with verification code
bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const code = match?.[1];

  if (!code) {
    bot.sendMessage(chatId, 'Invalid verification code. Please use the link from SquadVoice app.');
    return;
  }

  try {
    // Verify code with signal server
    const response = await axios.post(`${SIGNAL_SERVER_URL}/api/telegram/verify`, {
      code,
      telegramId: msg.from?.id,
    });

    if (response.data.success) {
      bot.sendMessage(
        chatId,
        '✅ Your Telegram account has been successfully linked to SquadVoice!\n\n' +
        'You will now receive notifications about:\n' +
        '• Mentions in channels\n' +
        '• Direct messages\n' +
        '• Server invites'
      );
    }
  } catch (error: any) {
    console.error('Error verifying Telegram link:', error);
    bot.sendMessage(
      chatId,
      '❌ Failed to link your account. The verification code may be invalid or expired.\n\n' +
      'Please try again from the SquadVoice app.'
    );
  }
});

// Handle /start without code
bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    '👋 Welcome to SquadVoice!\n\n' +
    'To link your Telegram account:\n' +
    '1. Open SquadVoice desktop app\n' +
    '2. Go to Settings → Link Telegram\n' +
    '3. Click the link to open this bot with a verification code'
  );
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    '📖 SquadVoice Bot Help\n\n' +
    'Commands:\n' +
    '/start <code> - Link your Telegram account\n' +
    '/help - Show this help message\n' +
    '/unlink - Unlink your Telegram account\n\n' +
    'For more information, visit: https://squadvoice.io'
  );
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
