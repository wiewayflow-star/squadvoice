import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SIGNAL_SERVER_URL = process.env.SIGNAL_SERVER_URL || 'http://localhost:8080';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('SquadVoice Telegram Bot started');

// /start <userId> — user clicked "Link Telegram" in the app
bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from?.id;
  const userId = match?.[1];

  if (!userId || !telegramId) {
    bot.sendMessage(chatId, '❌ Invalid link. Please use the button in SquadVoice app.');
    return;
  }

  try {
    // Save telegram_id to the pending link and get the code
    const res = await axios.post(`${SIGNAL_SERVER_URL}/api/telegram/save-telegram-id`, {
      userId,
      telegramId,
    });

    const code: string = res.data.code;

    // Send code to user
    bot.sendMessage(
      chatId,
      `🔐 Your SquadVoice verification code:\n\n` +
      `<b>${code.split('').join('  ')}</b>\n\n` +
      `Enter this code in the app to link your account.`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('Error saving telegram id:', error);
    bot.sendMessage(chatId, '❌ Something went wrong. Please try again from the app.');
  }
});

// /start without args
bot.onText(/\/start$/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    '👋 Welcome to SquadVoice!\n\nTo link your account, click "Link Telegram" in the SquadVoice desktop app.'
  );
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
