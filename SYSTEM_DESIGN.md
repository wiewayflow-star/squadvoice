# SquadVoice - System Design Document

## 1. Обзор системы

SquadVoice — это децентрализованная платформа для голосовых и текстовых коммуникаций с максимальной приватностью и минимальной нагрузкой на центральный сервер.

### Ключевые принципы
- **P2P-first**: Голос и сообщения идут напрямую между клиентами
- **E2E encryption**: Все данные зашифрованы end-to-end
- **Minimal server**: Сервер только для signaling и discovery
- **Free to use**: Базовая функциональность полностью бесплатна

## 2. Архитектура

### 2.1 High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐
│  Desktop Client │◄───P2P──►│  Desktop Client │
│   (Electron)    │         │   (Electron)    │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │    WebSocket Signaling    │
         └──────────┬────────────────┘
                    │
         ┌──────────▼──────────┐
         │   Signal Server     │
         │  (Node.js + WS)     │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │   PostgreSQL        │
         │   (Metadata only)   │
         └─────────────────────┘
```

### 2.2 Desktop Client Architecture

```
┌─────────────────────────────────────────────┐
│           Electron Main Process             │
│  ┌─────────────────────────────────────┐   │
│  │  Voice Engine (WebRTC + Opus)       │   │
│  │  - Audio capture/playback           │   │
│  │  - Echo cancellation                │   │
│  │  - Jitter buffer                    │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │  P2P Mesh Manager                   │   │
│  │  - Peer connections                 │   │
│  │  - Topology management              │   │
│  │  - NAT traversal (ICE)              │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │  Crypto Engine (Signal Protocol)    │   │
│  │  - X3DH key exchange                │   │
│  │  - Double Ratchet                   │   │
│  │  - Identity keys                    │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│         Electron Renderer Process           │
│  ┌─────────────────────────────────────┐   │
│  │  React UI                           │   │
│  │  - Registration flow                │   │
│  │  - Server/channel list              │   │
│  │  - Voice controls                   │   │
│  │  - Chat interface                   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 3. Голосовая система

### 3.1 Adaptive Topology

#### Small Rooms (<15 participants)
```
Full P2P Mesh - каждый соединен с каждым

    A ←→ B
    ↕ ╲ ╱ ↕
    C ←→ D

Преимущества:
- Минимальная задержка
- Нет single point of failure
- Простая реализация

Недостатки:
- O(n²) connections
- Высокая нагрузка на upload
```

#### Medium Rooms (15-30 participants)
```
Peer-hosted SFU - один из участников становится SFU

    A → SFU ← B
        ↓ ↑
    C ← ─ → D

Преимущества:
- O(n) connections
- Selective forwarding
- Active speaker detection

Недостатки:
- SFU host нагружен
- Зависимость от одного peer
```

#### Large Rooms (>30 participants)
```
Sub-mesh topology - группы по 10-15 участников

Mesh 1:        Mesh 2:
A ←→ B         E ←→ F
↕ ╲ ╱ ↕        ↕ ╲ ╱ ↕
C ←→ D         G ←→ H
  ↓              ↑
  └──── Relay ───┘

Преимущества:
- Масштабируемость
- Распределенная нагрузка
- Fault tolerance

Недостатки:
- Сложная реализация
- Возможна небольшая задержка
```

### 3.2 Voice Processing Pipeline

```
Microphone
    ↓
Audio Capture (48kHz)
    ↓
Pre-processing
    ├─ Noise suppression
    ├─ Echo cancellation (AEC)
    └─ Auto gain control
    ↓
Voice Activity Detection (VAD)
    ↓
Opus Encoding (16-32 kbps, mono)
    ↓
Encryption (AES-256-GCM)
    ↓
WebRTC Data Channel / UDP
    ↓
[Network]
    ↓
Decryption
    ↓
Opus Decoding
    ↓
Jitter Buffer (adaptive)
    ↓
Mixing (multiple speakers)
    ↓
Audio Playback
```

### 3.3 Codec Configuration

```javascript
// Opus settings
{
  sampleRate: 48000,
  channels: 1,  // mono для экономии bandwidth
  bitrate: 24000,  // 24 kbps (адаптивно 16-32)
  frameSize: 20,  // 20ms frames
  complexity: 5,  // balance quality/CPU
  vbr: true,  // variable bitrate
  fec: true   // forward error correction
}
```

## 4. E2E Encryption

### 4.1 Signal Protocol Implementation

#### Identity Keys (долгосрочные)
```
User generates:
- Identity Key Pair (Ed25519)
- User ID = SHA-256(public_identity_key)
```

#### X3DH Key Exchange (инициализация)
```
Alice wants to message Bob:

1. Alice fetches Bob's prekey bundle:
   - Identity Key (IK_B)
   - Signed Prekey (SPK_B)
   - One-time Prekey (OPK_B)

2. Alice generates ephemeral key (EK_A)

3. Alice computes shared secret:
   DH1 = DH(IK_A, SPK_B)
   DH2 = DH(EK_A, IK_B)
   DH3 = DH(EK_A, SPK_B)
   DH4 = DH(EK_A, OPK_B)
   
   SK = KDF(DH1 || DH2 || DH3 || DH4)

4. Alice sends initial message + EK_A
```

#### Double Ratchet (ongoing)
```
Each message:
1. Ratchet forward (derive new key)
2. Encrypt message with chain key
3. Send encrypted message + ratchet public key

Provides:
- Forward secrecy
- Break-in recovery
- Out-of-order message handling
```

### 4.2 Voice Encryption

```
Per-packet encryption:

1. Generate session key (ECDH)
2. Derive packet keys (HKDF)
3. Encrypt audio frame (AES-256-GCM)
4. Add authentication tag
5. Send encrypted packet

Packet format:
[Header (4B)] [Nonce (12B)] [Encrypted Audio] [Auth Tag (16B)]
```

## 5. Signal Server

### 5.1 Responsibilities

1. **Authentication**
   - User registration
   - Login/logout
   - Session management

2. **Peer Discovery**
   - Online user list
   - Server/channel membership
   - ICE candidate exchange

3. **Signaling**
   - WebRTC SDP exchange
   - Connection negotiation
   - Peer relay coordination

4. **Metadata Storage** (minimal)
   - User profiles (nickname, avatar hash)
   - Server/channel structure
   - Roles & permissions

### 5.2 WebSocket Protocol

```javascript
// Client → Server
{
  type: 'register',
  nickname: 'user123',
  publicKey: '...',
  signature: '...'
}

{
  type: 'join_channel',
  serverId: 'abc',
  channelId: 'voice-1'
}

{
  type: 'signal',
  to: 'peer_id',
  sdp: {...}
}

// Server → Client
{
  type: 'peer_joined',
  peerId: 'xyz',
  publicKey: '...'
}

{
  type: 'signal',
  from: 'peer_id',
  sdp: {...}
}
```

### 5.3 Database Schema

```sql
-- Users (minimal metadata)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  nickname VARCHAR(32) UNIQUE NOT NULL,
  password_hash VARCHAR(128) NOT NULL,
  public_key TEXT NOT NULL,
  telegram_id BIGINT UNIQUE,
  avatar_hash VARCHAR(64),
  display_name VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Servers
CREATE TABLE servers (
  id UUID PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Channels
CREATE TABLE channels (
  id UUID PRIMARY KEY,
  server_id UUID REFERENCES servers(id),
  name VARCHAR(64) NOT NULL,
  type VARCHAR(16) NOT NULL, -- 'voice' or 'text'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Server Members
CREATE TABLE server_members (
  server_id UUID REFERENCES servers(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(32) DEFAULT 'user',
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (server_id, user_id)
);

-- Telegram Links
CREATE TABLE telegram_links (
  user_id UUID REFERENCES users(id),
  telegram_id BIGINT UNIQUE NOT NULL,
  verification_code VARCHAR(32),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id)
);
```

## 6. Registration Flow

### 6.1 Client-Side Flow

```
1. Nickname Input
   ↓
2. Check availability (API call)
   ↓
3. Password Input
   ↓
4. Generate crypto keys locally
   - Identity key pair (Ed25519)
   - Prekey bundle
   ↓
5. Telegram Linking Screen
   ├─ "Link Telegram" → Open bot with code
   └─ "Later" → Show warning → Continue
   ↓
6. Display Name + Avatar
   ├─ Upload avatar → Hash and store
   └─ No avatar → Generate gradient + initial
   ↓
7. Submit registration
   ↓
8. Store keys locally (encrypted)
   ↓
9. Login automatically
```

### 6.2 Telegram Linking

```
Client:
1. Request linking code from server
2. Open Telegram bot: t.me/squadvoice_bot?start=CODE

Telegram Bot:
1. Receive /start CODE
2. Extract telegram_id
3. Call server API: /telegram/verify
4. Send confirmation message

Server:
1. Verify code
2. Link telegram_id ↔ user_id
3. Notify client via WebSocket
```

## 7. NAT Traversal

### 7.1 ICE Process

```
1. Gather ICE candidates:
   - Host candidates (local IPs)
   - Server reflexive (STUN)
   - Relayed (TURN fallback)

2. Exchange candidates via signaling server

3. Connectivity checks (STUN binding requests)

4. Select best candidate pair

5. Establish connection
```

### 7.2 STUN/TURN Configuration

```javascript
const iceServers = [
  // Free STUN servers
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  
  // Optional TURN (for strict NATs)
  {
    urls: 'turn:turn.squadvoice.io:3478',
    username: 'user',
    credential: 'pass'
  }
];
```

### 7.3 Peer Relay (бесплатная альтернатива TURN)

```
Если прямое P2P соединение невозможно:

Client A ←→ Relay Peer ←→ Client B

Relay Peer:
- Любой участник с хорошим соединением
- Автоматический выбор (lowest latency)
- Encrypted relay (end-to-end сохраняется)
```

## 8. Security Considerations

### 8.1 Threat Model

**Защита от:**
- MITM attacks (E2E encryption)
- Replay attacks (nonces, timestamps)
- Identity spoofing (signature verification)
- Packet injection (authentication tags)
- Metadata correlation (minimal server data)

**Не защищает от:**
- Compromised client device
- Malicious peer in voice channel
- Traffic analysis (timing, packet size)

### 8.2 Security Best Practices

1. **Key Storage**
   - Encrypt private keys with user password
   - Use OS keychain when available
   - Never send private keys to server

2. **Authentication**
   - Challenge-response (sign random nonce)
   - Session tokens (short-lived)
   - Rate limiting on server

3. **Network Security**
   - TLS for WebSocket signaling
   - DTLS for WebRTC data channels
   - Verify peer identity keys

4. **Privacy**
   - No message logging on server
   - Minimal metadata collection
   - Optional Tor routing

## 9. Performance Targets

### 9.1 Voice Quality
- Latency: <100ms (P2P), <200ms (relayed)
- Packet loss tolerance: up to 5%
- Jitter: <30ms
- Audio quality: MOS >4.0

### 9.2 Scalability
- Small rooms: 15 participants (full mesh)
- Medium rooms: 30 participants (peer SFU)
- Large rooms: 100+ participants (sub-mesh)

### 9.3 Resource Usage
- CPU: <5% idle, <20% in voice call
- RAM: <200MB idle, <500MB in large room
- Bandwidth: 24-32 kbps per voice stream
- Disk: <100MB app size, <50MB user data

## 10. Future Enhancements

- Screen sharing (WebRTC video)
- File transfers (P2P)
- Voice recording (local)
- Mobile clients (React Native)
- Federation (multiple signal servers)
- Blockchain-based identity (optional)
