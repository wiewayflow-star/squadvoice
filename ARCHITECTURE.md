# SquadVoice - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Desktop Clients                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Client A   │  │   Client B   │  │   Client C   │         │
│  │  (Electron)  │  │  (Electron)  │  │  (Electron)  │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│                    P2P Voice & Messages                          │
│                   (WebRTC + E2E Encrypted)                       │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ WebSocket Signaling
                             │ (SDP, ICE, Discovery)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Signal Server                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WebSocket Server (Port 8081)                            │  │
│  │  - Peer discovery                                        │  │
│  │  - SDP/ICE exchange                                      │  │
│  │  - Channel membership                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST API (Port 8080)                                    │  │
│  │  - User registration/login                               │  │
│  │  - Server/channel management                             │  │
│  │  - Telegram integration                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                     │  │
│  │  - User accounts (minimal metadata)                      │  │
│  │  - Server/channel structure                              │  │
│  │  - Roles & permissions                                   │  │
│  │  - Prekey bundles (for E2E)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Telegram Bot                               │
│  - Account linking                                              │
│  - Notifications                                                │
│  - Bot commands                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Desktop Client Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Electron Main Process                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Voice Engine                                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │ Audio I/O  │→ │ Processing │→ │   Opus     │        │  │
│  │  │  (WebRTC)  │  │ (AEC, NS)  │  │  Encoder   │        │  │
│  │  └────────────┘  └────────────┘  └────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  P2P Mesh Manager                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │   Peer     │  │    ICE     │  │  Topology  │        │  │
│  │  │ Connection │  │ Negotiation│  │  Manager   │        │  │
│  │  └────────────┘  └────────────┘  └────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Crypto Engine (Signal Protocol)                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │    X3DH    │  │   Double   │  │  Identity  │        │  │
│  │  │  Exchange  │  │  Ratchet   │  │    Keys    │        │  │
│  │  └────────────┘  └────────────┘  └────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Storage Manager                                         │  │
│  │  - Encrypted key storage                                 │  │
│  │  - Local message history (IndexedDB)                     │  │
│  │  - User settings                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │ IPC
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Electron Renderer Process                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React UI (TypeScript + Tailwind CSS)                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │Registration│  │   Server   │  │   Voice    │        │  │
│  │  │    Flow    │  │   List     │  │  Controls  │        │  │
│  │  └────────────┘  └────────────┘  └────────────┘        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │  Channel   │  │    Chat    │  │   User     │        │  │
│  │  │    List    │  │ Interface  │  │  Profile   │        │  │
│  │  └────────────┘  └────────────┘  └────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Voice Topology Evolution

### Small Rooms (<15 participants)
```
Full P2P Mesh - Everyone connected to everyone

    A ←→ B
    ↕ ╲ ╱ ↕
    C ←→ D

Bandwidth per user: (n-1) × 24 kbps upload
Example: 10 users = 9 × 24 = 216 kbps upload
```

### Medium Rooms (15-30 participants)
```
Peer-hosted SFU - One peer acts as forwarder

    A ──┐
    B ──┤
    C ──┼→ SFU (Peer D) ──→ Selective Forward
    E ──┤                    (Active speakers only)
    F ──┘

Bandwidth per user: 24 kbps upload (constant)
SFU host: (n-1) × 24 kbps download, k × 24 kbps upload
where k = active speakers (typically 3-5)
```

### Large Rooms (>30 participants)
```
Sub-mesh Topology - Multiple small meshes with relays

Mesh 1:          Mesh 2:          Mesh 3:
A ←→ B           E ←→ F           I ←→ J
↕ ╲ ╱ ↕          ↕ ╲ ╱ ↕          ↕ ╲ ╱ ↕
C ←→ D           G ←→ H           K ←→ L
  ↓                ↓                ↓
  └────── Relay ───┴──── Relay ────┘
         (Active speakers only)

Bandwidth per user: 3-4 × 24 kbps = 72-96 kbps
Scalable to 100+ participants
```

## Data Flow

### Voice Packet Flow
```
Microphone
    ↓
Audio Capture (48kHz, mono)
    ↓
Pre-processing
    ├─ Noise Suppression
    ├─ Echo Cancellation (AEC)
    └─ Auto Gain Control
    ↓
Voice Activity Detection (VAD)
    ↓ (if speaking)
Opus Encoding (16-32 kbps)
    ↓
Encryption (AES-256-GCM)
    ↓
WebRTC Data Channel / UDP
    ↓
[Network - P2P]
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

### Message Flow
```
User Input
    ↓
Message Text
    ↓
Signal Protocol Encryption
    ├─ Fetch prekey bundle (if first message)
    ├─ Establish session
    └─ Encrypt with ratchet key
    ↓
WebRTC Data Channel (P2P)
    ↓ (fallback if P2P fails)
Signaling Server Relay
    ↓
[Network]
    ↓
Receive Encrypted Message
    ↓
Signal Protocol Decryption
    ├─ Verify sender identity
    ├─ Decrypt with ratchet key
    └─ Ratchet forward
    ↓
Display Message
    ↓
Store Locally (encrypted)
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Application Layer                                          │
│  - Signal Protocol (E2E encryption)                         │
│  - Message authentication                                   │
│  - Forward secrecy                                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Transport Layer                                            │
│  - DTLS (WebRTC)                                            │
│  - TLS (WebSocket signaling)                                │
│  - Encrypted voice packets (AES-256-GCM)                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Network Layer                                              │
│  - P2P connections (NAT traversal)                          │
│  - ICE/STUN/TURN                                            │
│  - Optional Tor routing                                     │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Strategy

| Room Size | Topology | Connections per User | Bandwidth (Upload) |
|-----------|----------|---------------------|-------------------|
| 2-15      | Full Mesh | n-1                | (n-1) × 24 kbps   |
| 15-30     | Peer SFU  | 1                  | 24 kbps           |
| 30-100    | Sub-mesh  | 3-4                | 72-96 kbps        |
| 100+      | Cloud SFU | 1                  | 24 kbps           |

## Technology Stack Summary

### Frontend (Desktop Client)
- **Framework**: Electron 28+
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **WebRTC**: Native WebRTC API
- **Crypto**: TweetNaCl (Ed25519, X25519)
- **Storage**: IndexedDB + localStorage

### Backend (Signal Server)
- **Runtime**: Node.js 18+
- **Framework**: Express
- **WebSocket**: ws library
- **Database**: PostgreSQL 14+
- **Auth**: JWT + bcrypt
- **Language**: TypeScript

### Telegram Bot
- **Library**: node-telegram-bot-api
- **Integration**: REST API to Signal Server

### Protocols
- **Voice**: WebRTC + Opus codec
- **Messaging**: Signal Protocol (X3DH + Double Ratchet)
- **Signaling**: Custom WebSocket protocol
- **NAT Traversal**: ICE + STUN/TURN

## Performance Characteristics

### Latency
- P2P voice: 50-100ms
- Relayed voice: 100-200ms
- Messages: <50ms (P2P), <100ms (relayed)

### Resource Usage
- CPU: 3-5% idle, 15-20% in voice call
- RAM: 150-200MB idle, 300-500MB in large room
- Disk: <100MB app, <50MB user data
- Network: 24-32 kbps per voice stream

### Scalability
- Concurrent users per server: 10,000+
- Max room size (P2P): 15 participants
- Max room size (peer SFU): 30 participants
- Max room size (sub-mesh): 100+ participants

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Production Deployment                                      │
│                                                             │
│  ┌──────────────┐     ┌──────────────┐                    │
│  │   Nginx      │────▶│ Signal Server│                    │
│  │ (Reverse     │     │  (Node.js)   │                    │
│  │  Proxy)      │     │  Port 8080   │                    │
│  └──────────────┘     └──────┬───────┘                    │
│         │                     │                             │
│         │                     ▼                             │
│         │            ┌──────────────┐                      │
│         │            │ PostgreSQL   │                      │
│         │            │  (Primary)   │                      │
│         │            └──────────────┘                      │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐                                          │
│  │ STUN/TURN    │                                          │
│  │  (coturn)    │                                          │
│  └──────────────┘                                          │
│                                                             │
│  Desktop Clients connect via:                              │
│  - HTTPS (REST API)                                        │
│  - WSS (WebSocket)                                         │
│  - P2P (WebRTC)                                            │
└─────────────────────────────────────────────────────────────┘
```
