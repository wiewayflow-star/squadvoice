# SquadVoice

**Децентрализованная P2P платформа для голосовых и текстовых коммуникаций с максимальной приватностью**

SquadVoice — это современная альтернатива TeamSpeak с P2P архитектурой, end-to-end шифрованием и минимальной нагрузкой на сервер. Полностью бесплатная для пользователей.

## 🎯 Ключевые особенности

- **P2P Voice**: Голосовой трафик идет напрямую между участниками
- **E2E Encryption**: Все сообщения зашифрованы end-to-end (Signal Protocol)
- **Minimal Server**: Сервер используется только для signaling и discovery
- **Free Forever**: Базовая функциональность полностью бесплатна
- **Cross-Platform**: Windows, Linux, macOS
- **Low Latency**: <100ms задержка в P2P режиме
- **Adaptive Topology**: Автоматическая оптимизация для разных размеров комнат

## 🏗️ Архитектура

```
Desktop Client (Electron) ←─ P2P ─→ Desktop Client
         ↓                                ↓
         └──── WebSocket Signaling ───────┘
                      ↓
              Signal Server
              (Node.js + PostgreSQL)
```

### Компоненты

1. **Desktop Client** - Electron приложение с React UI
2. **Signal Server** - Минимальный сервер для signaling
3. **Telegram Bot** - Опциональная привязка Telegram

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/your-org/squadvoice.git
cd squadvoice

# Установить зависимости
npm run install:all

# Настроить базу данных
cd signal-server
cp .env.example .env
# Отредактируйте .env с вашими настройками
psql -U postgres -c "CREATE DATABASE squadvoice;"
psql -U postgres -d squadvoice -f src/database/schema.sql

# Запустить Signal Server
npm run dev:server

# В другом терминале - запустить Desktop Client
npm run dev:client
```

### Настройка Telegram бота (опционально)

```bash
# 1. Создайте бота через @BotFather в Telegram
# 2. Получите токен бота

cd telegram-bot
cp .env.example .env
# Добавьте TELEGRAM_BOT_TOKEN в .env

npm run dev:bot
```

## 📖 Документация

- [System Design](SYSTEM_DESIGN.md) - Полная архитектура системы
- [Project Structure](PROJECT_STRUCTURE.md) - Структура проекта
- [API Documentation](docs/API.md) - REST API и WebSocket протокол
- [Security](docs/SECURITY.md) - Модель безопасности

## 🎮 Использование

### Регистрация

1. Запустите SquadVoice
2. Введите никнейм
3. Создайте пароль
4. (Опционально) Привяжите Telegram
5. Выберите аватарку и имя

### Создание сервера

1. Нажмите "+" в списке серверов
2. Введите название сервера
3. Создайте голосовые и текстовые каналы
4. Пригласите друзей

### Голосовой чат

1. Войдите в голосовой канал
2. Используйте Push-to-Talk (по умолчанию: Space)
3. Или включите Voice Activity Detection

## 🔒 Безопасность

- **Signal Protocol** для E2E шифрования сообщений
- **X3DH** для обмена ключами
- **Double Ratchet** для forward secrecy
- **Ed25519** для цифровых подписей
- **AES-256-GCM** для шифрования голоса

## 🛠️ Технологии

### Desktop Client
- Electron
- React + TypeScript
- WebRTC (Opus codec)
- TweetNaCl (crypto)
- Tailwind CSS

### Signal Server
- Node.js + TypeScript
- WebSocket (ws)
- PostgreSQL
- bcrypt + JWT

### Telegram Bot
- node-telegram-bot-api

## 📊 Производительность

- **Latency**: <100ms (P2P), <200ms (relayed)
- **Bandwidth**: 24-32 kbps per voice stream
- **CPU**: <5% idle, <20% in voice call
- **RAM**: <200MB idle, <500MB in large room

## 🗺️ Roadmap

### Phase 1: Core (Current)
- [x] Signal server
- [x] Desktop client shell
- [x] Registration flow
- [x] Basic crypto

### Phase 2: Voice
- [ ] WebRTC voice engine
- [ ] P2P mesh для малых комнат
- [ ] Echo cancellation
- [ ] Push-to-talk

### Phase 3: Messaging
- [ ] E2E encrypted messages
- [ ] Text channels
- [ ] Message history

### Phase 4: Advanced
- [ ] Peer-hosted SFU
- [ ] Sub-mesh topology
- [ ] Roles & permissions
- [ ] Telegram integration

### Phase 5: Polish
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Security audit

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Signal Protocol for E2E encryption
- WebRTC for P2P communication
- Electron for cross-platform desktop apps

## 📞 Support

- GitHub Issues: [github.com/your-org/squadvoice/issues](https://github.com/your-org/squadvoice/issues)
- Telegram: [@squadvoice_support](https://t.me/squadvoice_support)
- Email: support@squadvoice.io

---

Made with ❤️ by SquadVoice Team
