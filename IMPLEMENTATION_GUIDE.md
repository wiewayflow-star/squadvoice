# SquadVoice - Implementation Guide

Этот документ описывает следующие шаги для завершения реализации SquadVoice.

## ✅ Что уже сделано

1. **Структура проекта**
   - Monorepo с workspaces (desktop-client, signal-server, telegram-bot, shared)
   - TypeScript конфигурация
   - Build scripts

2. **Signal Server**
   - WebSocket signaling server
   - REST API для регистрации/логина
   - PostgreSQL схема
   - JWT аутентификация
   - Telegram linking API

3. **Desktop Client**
   - Electron shell
   - React UI с Tailwind CSS
   - Registration flow (4 шага)
   - Crypto keys generation (TweetNaCl)
   - Basic layout

4. **Telegram Bot**
   - Bot для привязки аккаунтов
   - Verification flow

5. **Shared**
   - Общие типы
   - Signaling protocol

## 🚧 Что нужно реализовать

### Priority 1: Voice Engine (Core функциональность)

#### 1.1 WebRTC Voice Manager
```typescript
// desktop-client/src/voice/VoiceManager.ts
class VoiceManager {
  - setupAudioDevices()
  - startCapture()
  - stopCapture()
  - createPeerConnection(peerId)
  - handleIncomingStream(stream)
  - applyAudioProcessing() // echo cancellation, noise suppression
}
```

#### 1.2 Audio Processing
- Интеграция WebRTC AEC (Acoustic Echo Cancellation)
- Noise suppression
- Auto gain control
- Jitter buffer

#### 1.3 Opus Codec Configuration
```javascript
const opusConfig = {
  sampleRate: 48000,
  channels: 1,
  bitrate: 24000,
  frameSize: 20,
  complexity: 5,
  vbr: true,
  fec: true
};
```

#### 1.4 Voice Activity Detection (VAD)
- Определение когда пользователь говорит
- Автоматическое отключение неактивных потоков
- Push-to-talk режим

### Priority 2: P2P Mesh Networking

#### 2.1 Peer Connection Manager
```typescript
// desktop-client/src/p2p/PeerManager.ts
class PeerManager {
  - connectToPeer(peerId, offer?)
  - handleSignal(signal)
  - handleIceCandidate(candidate)
  - disconnectPeer(peerId)
  - getActivePeers()
}
```

#### 2.2 Mesh Topology для малых комнат (<15 участников)
- Full mesh: каждый соединен с каждым
- Автоматическое создание RTCPeerConnection
- Обмен SDP через signaling server

#### 2.3 ICE/STUN/TURN
- Настройка STUN серверов (Google STUN)
- Опционально: TURN сервер (coturn)
- Peer relay как fallback

### Priority 3: E2E Encrypted Messaging

#### 3.1 Signal Protocol Implementation
```typescript
// desktop-client/src/crypto/signal.ts
class SignalProtocol {
  - generatePreKeyBundle()
  - initiateSession(peerPublicKey, preKeyBundle)
  - encryptMessage(message, sessionId)
  - decryptMessage(encrypted, sessionId)
  - ratchetForward()
}
```

#### 3.2 Message Manager
```typescript
// desktop-client/src/messaging/MessageManager.ts
class MessageManager {
  - sendMessage(channelId, text)
  - receiveMessage(encrypted)
  - getMessageHistory(channelId)
  - storeMessageLocally(message)
}
```

#### 3.3 WebRTC Data Channels
- Создание data channel для каждого peer
- Отправка зашифрованных сообщений через data channel
- Fallback через signaling server

### Priority 4: UI Components

#### 4.1 Voice Controls
```tsx
// desktop-client/src/renderer/components/VoiceControls.tsx
- Microphone mute/unmute
- Deafen (отключить звук)
- Push-to-talk indicator
- Volume slider
- Audio device selection
```

#### 4.2 Channel Management
```tsx
// desktop-client/src/renderer/components/ChannelList.tsx
- Create channel
- Join/leave voice channel
- Channel permissions
- User list in channel
```

#### 4.3 Chat Interface
```tsx
// desktop-client/src/renderer/components/Chat.tsx
- Message list
- Message input
- File upload (future)
- Emoji picker (future)
```

#### 4.4 Server Management
```tsx
// desktop-client/src/renderer/components/ServerSettings.tsx
- Create server
- Invite users
- Manage roles
- Channel settings
```

### Priority 5: Advanced Features

#### 5.1 Peer-hosted SFU (15-30 участников)
```typescript
// desktop-client/src/voice/SFU.ts
class PeerSFU {
  - becomeHost()
  - forwardAudio(fromPeer, toPeers)
  - selectiveSend() // active speaker detection
  - handleHostMigration()
}
```

#### 5.2 Sub-mesh Topology (>30 участников)
- Разделение на группы по 10-15 участников
- Relay между группами
- Динамическая балансировка

#### 5.3 Roles & Permissions
```typescript
interface Permission {
  canSpeak: boolean;
  canMute: boolean;
  canKick: boolean;
  canBan: boolean;
  canManageChannels: boolean;
}
```

### Priority 6: Storage & Persistence

#### 6.1 Local Storage
```typescript
// desktop-client/src/storage/LocalStorage.ts
class LocalStorage {
  - saveKeys(encrypted)
  - loadKeys()
  - saveMessages(channelId, messages)
  - loadMessages(channelId)
  - saveSettings(settings)
}
```

#### 6.2 IndexedDB для сообщений
- Хранение истории сообщений локально
- Шифрование базы данных
- Очистка старых сообщений

### Priority 7: Telegram Integration

#### 7.1 Notifications
- Уведомления о mentions
- Уведомления о DM
- Уведомления о приглашениях

#### 7.2 Bot Commands
```
/servers - Список ваших серверов
/status - Статус онлайн/оффлайн
/mute - Отключить уведомления
```

## 🔧 Технические детали

### WebRTC Configuration

```javascript
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Optional TURN
    {
      urls: 'turn:turn.squadvoice.io:3478',
      username: 'user',
      credential: 'pass'
    }
  ],
  iceTransportPolicy: 'all',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};
```

### Audio Constraints

```javascript
const audioConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
    channelCount: 1
  },
  video: false
};
```

### Message Encryption Flow

```
1. Alice wants to send message to Bob
2. Alice fetches Bob's prekey bundle (if first message)
3. Alice establishes Signal session
4. Alice encrypts message with session key
5. Alice sends encrypted message via WebRTC data channel
6. Bob receives and decrypts message
7. Both ratchet forward for next message
```

## 📝 Testing Strategy

### Unit Tests
- Crypto functions (key generation, encryption, signatures)
- Message encoding/decoding
- Signaling protocol

### Integration Tests
- WebSocket connection
- Peer connection establishment
- Audio streaming
- Message delivery

### E2E Tests
- Full registration flow
- Join voice channel
- Send/receive messages
- Disconnect/reconnect

## 🚀 Deployment

### Signal Server
```bash
# Production build
cd signal-server
npm run build
npm start

# With PM2
pm2 start dist/index.js --name squadvoice-server
```

### Desktop Client
```bash
# Build for all platforms
cd desktop-client
npm run build
npm run package

# Output: dist/SquadVoice-{version}-{platform}.{ext}
```

### Telegram Bot
```bash
cd telegram-bot
npm run build
npm start

# With PM2
pm2 start dist/index.js --name squadvoice-bot
```

## 🔐 Security Checklist

- [ ] Private keys никогда не покидают клиент
- [ ] Все сообщения E2E encrypted
- [ ] Пароли хешируются с bcrypt (12 rounds)
- [ ] JWT токены с коротким TTL
- [ ] Rate limiting на API endpoints
- [ ] Input validation на всех endpoints
- [ ] HTTPS для production
- [ ] WSS для WebSocket в production
- [ ] Регулярное обновление зависимостей

## 📚 Полезные ресурсы

- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Signal Protocol](https://signal.org/docs/)
- [Opus Codec](https://opus-codec.org/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Simple Peer](https://github.com/feross/simple-peer)

## 🎯 Next Steps

1. Реализовать WebRTC voice engine
2. Добавить P2P mesh для малых комнат
3. Интегрировать audio processing
4. Реализовать E2E messaging
5. Улучшить UI/UX
6. Добавить тесты
7. Security audit
8. Production deployment

---

Удачи в разработке! 🚀
