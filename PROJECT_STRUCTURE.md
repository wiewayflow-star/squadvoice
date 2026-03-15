# SquadVoice - Project Structure

## Архитектура системы

```
squadvoice/
├── desktop-client/          # Electron приложение (Windows/Linux/macOS)
│   ├── src/
│   │   ├── main/           # Main process
│   │   ├── renderer/       # UI (React + TypeScript)
│   │   ├── crypto/         # E2E encryption (Signal Protocol)
│   │   ├── voice/          # WebRTC voice engine
│   │   ├── p2p/            # P2P mesh networking
│   │   └── storage/        # Local encrypted storage
│   └── package.json
│
├── signal-server/          # Минимальный signaling server
│   ├── src/
│   │   ├── websocket/     # WebSocket signaling
│   │   ├── auth/          # Authentication
│   │   ├── discovery/     # Peer discovery
│   │   └── telegram/      # Telegram bot integration
│   └── package.json
│
├── telegram-bot/          # Telegram бот для привязки
│   └── src/
│
└── shared/               # Общие типы и утилиты
    └── protocols/
```

## Технологический стек

### Desktop Client
- **Framework**: Electron (кросс-платформенность)
- **UI**: React + TypeScript + Tailwind CSS
- **Voice**: WebRTC (Opus codec)
- **P2P**: simple-peer / libp2p
- **Crypto**: @signalapp/libsignal-client
- **Storage**: IndexedDB + encryption

### Signal Server
- **Runtime**: Node.js + TypeScript
- **WebSocket**: ws / socket.io
- **Database**: PostgreSQL (минимальная metadata)
- **Cache**: Redis (sessions, peer discovery)
- **STUN/TURN**: coturn (опционально)

### Telegram Bot
- **Library**: node-telegram-bot-api
- **Integration**: REST API к signal server

## Ключевые компоненты

### 1. Voice Engine
- Opus codec (16-32 kbps)
- Echo cancellation (WebRTC AEC)
- Jitter buffer
- VAD (Voice Activity Detection)
- Push-to-talk
- Selective forwarding для >10 участников

### 2. P2P Mesh System
- **Small rooms (<15)**: Full mesh
- **Medium rooms (15-30)**: Peer-hosted SFU
- **Large rooms (>30)**: Sub-mesh topology

### 3. E2E Encryption
- Signal Protocol (X3DH + Double Ratchet)
- Per-message encryption
- Forward secrecy
- Identity keys (Ed25519)

### 4. Registration Flow
1. Nickname check
2. Password input
3. Telegram linking (optional)
4. Avatar + display name

## Приоритеты реализации

### Phase 1: Core Infrastructure
- [ ] Signal server (WebSocket, auth, discovery)
- [ ] Desktop client shell (Electron + React)
- [ ] Basic crypto (key generation, storage)
- [ ] Registration flow

### Phase 2: Voice System
- [ ] WebRTC voice engine
- [ ] P2P mesh для малых комнат
- [ ] Audio processing (echo cancellation, VAD)
- [ ] Push-to-talk

### Phase 3: Messaging
- [ ] E2E encrypted messages
- [ ] Text channels
- [ ] Message history (local)

### Phase 4: Advanced Features
- [ ] Peer-hosted SFU для средних комнат
- [ ] Sub-mesh для больших комнат
- [ ] Roles & permissions
- [ ] Telegram integration

### Phase 5: Polish
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
