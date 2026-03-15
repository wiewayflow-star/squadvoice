# SquadVoice - Project Summary

## 📋 Обзор проекта

SquadVoice — это полнофункциональная децентрализованная платформа для голосовых и текстовых коммуникаций с максимальной приватностью. Современная альтернатива TeamSpeak с P2P архитектурой, end-to-end шифрованием и минимальной нагрузкой на сервер.

## ✅ Что реализовано

### 1. Структура проекта
- Monorepo с 4 workspace: desktop-client, signal-server, telegram-bot, shared
- TypeScript конфигурация для всех проектов
- Build scripts и dev environment
- Полная документация

### 2. Signal Server (Node.js + PostgreSQL)
```
signal-server/
├── src/
│   ├── index.ts              # Entry point
│   ├── websocket/server.ts   # WebSocket signaling
│   ├── api/routes.ts         # REST API endpoints
│   ├── auth/auth.ts          # JWT + bcrypt auth
│   └── database/
│       ├── db.ts             # PostgreSQL connection
│       └── schema.sql        # Database schema
```

**Функциональность:**
- WebSocket сервер для signaling (SDP/ICE exchange)
- REST API для регистрации/логина
- Peer discovery и channel management
- JWT аутентификация
- Telegram linking API
- PostgreSQL для хранения метаданных

### 3. Desktop Client (Electron + React)
```
desktop-client/
├── src/
│   ├── main/
│   │   ├── index.ts          # Electron main process
│   │   └── preload.ts        # IPC bridge
│   ├── renderer/
│   │   ├── App.tsx           # Main app component
│   │   ├── components/
│   │   │   ├── Registration.tsx
│   │   │   ├── MainApp.tsx
│   │   │   └── registration/
│   │   │       ├── NicknameStep.tsx
│   │   │       ├── PasswordStep.tsx
│   │   │       ├── TelegramStep.tsx
│   │   │       └── ProfileStep.tsx
│   │   └── index.css
│   └── crypto/
│       └── keys.ts           # TweetNaCl crypto
```

**Функциональность:**
- Electron shell для кросс-платформенности
- React UI с Tailwind CSS
- 4-шаговая регистрация:
  1. Nickname (с проверкой доступности)
  2. Password
  3. Telegram linking (опционально)
  4. Profile (display name + avatar)
- Генерация криптографических ключей (Ed25519)
- Базовый layout (server list, channel list, chat)

### 4. Telegram Bot
```
telegram-bot/
└── src/
    └── index.ts              # Bot implementation
```

**Функциональность:**
- Привязка Telegram аккаунта через /start CODE
- Verification flow с signal server
- Базовые команды (/help, /start)

### 5. Shared Types
```
shared/
└── src/
    ├── types/index.ts        # Общие TypeScript типы
    └── protocols/signaling.ts # Signaling protocol
```

### 6. Документация
- `README.md` - Общее описание проекта
- `SYSTEM_DESIGN.md` - Полная архитектура системы (200+ строк)
- `PROJECT_STRUCTURE.md` - Структура проекта и tech stack
- `IMPLEMENTATION_GUIDE.md` - Детальный план реализации
- `QUICK_START.md` - Быстрый старт для разработчиков
- `ARCHITECTURE.md` - Визуализация архитектуры
- `ROADMAP.md` - План разработки по фазам
- `CONTRIBUTING.md` - Гайд для контрибьюторов
- `docs/API.md` - REST API и WebSocket протокол

## 🚧 Что нужно реализовать

### Priority 1: Voice Engine
- WebRTC voice capture/playback
- Opus codec integration
- Audio processing (echo cancellation, noise suppression)
- Voice Activity Detection
- Push-to-talk
- P2P mesh для малых комнат

### Priority 2: P2P Networking
- Peer connection manager
- ICE/STUN/TURN integration
- Mesh topology
- NAT traversal

### Priority 3: E2E Messaging
- Signal Protocol (X3DH + Double Ratchet)
- WebRTC data channels
- Message encryption/decryption
- Local message storage

### Priority 4: Advanced Features
- Peer-hosted SFU (15-30 users)
- Sub-mesh topology (30+ users)
- Roles & permissions
- Server management

## 📊 Технологический стек

### Frontend
- Electron 28+ (кросс-платформенность)
- React 18 + TypeScript
- Tailwind CSS (styling)
- WebRTC (voice/video)
- TweetNaCl (cryptography)

### Backend
- Node.js 18+ + TypeScript
- Express (REST API)
- ws (WebSocket)
- PostgreSQL 14+ (metadata)
- bcrypt + JWT (auth)

### Protocols
- WebRTC + Opus (voice)
- Signal Protocol (E2E encryption)
- Custom WebSocket (signaling)
- ICE/STUN/TURN (NAT traversal)

## 🏗️ Архитектура

```
Desktop Clients (P2P) ←→ Signal Server ←→ PostgreSQL
                                ↓
                         Telegram Bot
```

### Ключевые принципы
1. **P2P-first**: Голос и сообщения идут напрямую между клиентами
2. **E2E encryption**: Все данные зашифрованы end-to-end
3. **Minimal server**: Сервер только для signaling и discovery
4. **Free to use**: Базовая функциональность полностью бесплатна

## 📁 Структура файлов

```
squadvoice/
├── desktop-client/          # Electron app
│   ├── src/
│   │   ├── main/           # Main process
│   │   ├── renderer/       # React UI
│   │   └── crypto/         # Crypto functions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── signal-server/          # Node.js server
│   ├── src/
│   │   ├── index.ts
│   │   ├── websocket/
│   │   ├── api/
│   │   ├── auth/
│   │   └── database/
│   ├── package.json
│   └── tsconfig.json
│
├── telegram-bot/           # Telegram integration
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                 # Shared types
│   ├── src/
│   │   ├── types/
│   │   └── protocols/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                   # Documentation
│   └── API.md
│
├── package.json            # Root package
├── README.md
├── SYSTEM_DESIGN.md
├── IMPLEMENTATION_GUIDE.md
├── QUICK_START.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

## 🚀 Быстрый старт

```bash
# 1. Установка
npm install
npm run install:all

# 2. База данных
psql -U postgres -c "CREATE DATABASE squadvoice;"
cd signal-server
psql -U postgres -d squadvoice -f src/database/schema.sql

# 3. Настройка
cd signal-server && cp .env.example .env
cd telegram-bot && cp .env.example .env

# 4. Запуск
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2
npm run dev:bot     # Terminal 3 (optional)
```

## 📈 Roadmap

- **Phase 1** (Weeks 1-2): Foundation ✅ DONE
- **Phase 2** (Weeks 3-5): Voice Engine 🚧 NEXT
- **Phase 3** (Weeks 6-7): Messaging
- **Phase 4** (Weeks 8-10): Advanced Voice
- **Phase 5** (Weeks 11-12): Server Management
- **Phase 6** (Weeks 13-15): Polish & Optimization
- **Phase 7** (Weeks 16-17): Security Audit
- **Phase 8** (Week 18): Beta Release

## 🎯 Следующие шаги

1. **Реализовать WebRTC voice engine**
   - Audio capture/playback
   - Opus encoding/decoding
   - Echo cancellation

2. **Добавить P2P mesh networking**
   - Peer connection manager
   - ICE negotiation
   - Mesh topology

3. **Интегрировать audio processing**
   - Noise suppression
   - VAD
   - Jitter buffer

4. **Реализовать E2E messaging**
   - Signal Protocol
   - Data channels
   - Message encryption

## 📚 Документация

Вся документация находится в корне проекта:
- Архитектура: `SYSTEM_DESIGN.md`, `ARCHITECTURE.md`
- Разработка: `IMPLEMENTATION_GUIDE.md`, `CONTRIBUTING.md`
- Использование: `README.md`, `QUICK_START.md`
- API: `docs/API.md`
- План: `ROADMAP.md`

## 🔒 Безопасность

- Signal Protocol для E2E encryption
- Ed25519 для цифровых подписей
- bcrypt для паролей (12 rounds)
- JWT для сессий
- TLS/WSS в production
- Приватные ключи никогда не покидают клиент

## 📊 Производительность

Целевые метрики:
- Latency: <100ms (P2P)
- CPU: <20% в голосовом чате
- RAM: <500MB в большой комнате
- Bandwidth: 24-32 kbps per stream

## 🤝 Contributing

Проект открыт для контрибьюций! См. `CONTRIBUTING.md`

## 📄 License

MIT License - см. `LICENSE`

---

**Статус проекта**: Phase 1 Complete ✅  
**Следующий шаг**: Voice Engine Implementation 🎤  
**Последнее обновление**: March 2026
