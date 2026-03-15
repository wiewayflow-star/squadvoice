# SquadVoice API Documentation

## REST API

Base URL: `http://localhost:8080/api`

### Authentication

#### Check Nickname Availability
```http
GET /check-nickname/:nickname
```

Response:
```json
{
  "available": true
}
```

#### Register
```http
POST /register
Content-Type: application/json

{
  "nickname": "user123",
  "password": "securepassword",
  "publicKey": "base64_encoded_public_key",
  "displayName": "John Doe",
  "avatarHash": "optional_avatar_hash"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "nickname": "user123",
    "displayName": "John Doe",
    "createdAt": "2026-03-15T10:00:00Z"
  },
  "token": "jwt_token"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "nickname": "user123",
  "password": "securepassword"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "nickname": "user123",
    "displayName": "John Doe",
    "avatarHash": "hash"
  },
  "token": "jwt_token"
}
```

### Telegram Integration

#### Request Linking Code
```http
POST /telegram/request-link
Content-Type: application/json

{
  "userId": "uuid"
}
```

Response:
```json
{
  "code": "abc12345"
}
```

#### Verify Telegram Link (called by bot)
```http
POST /telegram/verify
Content-Type: application/json

{
  "code": "abc12345",
  "telegramId": 123456789
}
```

Response:
```json
{
  "success": true,
  "userId": "uuid"
}
```

## WebSocket Protocol

WebSocket URL: `ws://localhost:8081`

### Message Format

All messages follow this structure:
```json
{
  "type": "message_type",
  "payload": {},
  "timestamp": 1234567890
}
```

### Client → Server Messages

#### Login
```json
{
  "type": "login",
  "payload": {
    "token": "jwt_token"
  }
}
```

#### Join Channel
```json
{
  "type": "join_channel",
  "payload": {
    "channelId": "channel_uuid"
  }
}
```

#### Leave Channel
```json
{
  "type": "leave_channel",
  "payload": {
    "channelId": "channel_uuid"
  }
}
```

#### Signal (WebRTC)
```json
{
  "type": "signal",
  "payload": {
    "to": "peer_user_id",
    "sdp": {
      "type": "offer",
      "sdp": "..."
    }
  }
}
```

#### ICE Candidate
```json
{
  "type": "ice_candidate",
  "payload": {
    "to": "peer_user_id",
    "candidate": {
      "candidate": "...",
      "sdpMLineIndex": 0,
      "sdpMid": "0"
    }
  }
}
```

### Server → Client Messages

#### Login Success
```json
{
  "type": "login",
  "payload": {
    "success": true,
    "userId": "uuid"
  }
}
```

#### Join Channel Success
```json
{
  "type": "join_channel",
  "payload": {
    "channelId": "channel_uuid",
    "members": [
      {
        "peerId": "user_id",
        "nickname": "user123"
      }
    ]
  }
}
```

#### Peer Joined
```json
{
  "type": "peer_joined",
  "payload": {
    "peerId": "user_id",
    "nickname": "user123",
    "channelId": "channel_uuid"
  }
}
```

#### Peer Left
```json
{
  "type": "peer_left",
  "payload": {
    "peerId": "user_id",
    "channelId": "channel_uuid"
  }
}
```

#### Signal (WebRTC)
```json
{
  "type": "signal",
  "payload": {
    "from": "peer_user_id",
    "sdp": {
      "type": "answer",
      "sdp": "..."
    }
  }
}
```

#### ICE Candidate
```json
{
  "type": "ice_candidate",
  "payload": {
    "from": "peer_user_id",
    "candidate": {
      "candidate": "...",
      "sdpMLineIndex": 0,
      "sdpMid": "0"
    }
  }
}
```

#### Error
```json
{
  "type": "error",
  "payload": {
    "error": "Error message"
  }
}
```

## WebRTC Flow

### Establishing P2P Connection

1. **User A joins channel**
   ```
   A → Server: join_channel
   Server → A: join_channel (with existing members)
   Server → B,C,D: peer_joined (A joined)
   ```

2. **A creates offers to all existing peers**
   ```
   A creates RTCPeerConnection for B
   A creates offer
   A → Server: signal { to: B, sdp: offer }
   Server → B: signal { from: A, sdp: offer }
   ```

3. **B creates answer**
   ```
   B creates RTCPeerConnection for A
   B sets remote description (offer)
   B creates answer
   B → Server: signal { to: A, sdp: answer }
   Server → A: signal { from: B, sdp: answer }
   ```

4. **ICE candidates exchange**
   ```
   A → Server: ice_candidate { to: B, candidate }
   Server → B: ice_candidate { from: A, candidate }
   
   B → Server: ice_candidate { to: A, candidate }
   Server → A: ice_candidate { from: B, candidate }
   ```

5. **Connection established**
   ```
   A ←─ P2P ─→ B
   Audio streams flow directly
   ```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Invalid credentials or token |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Nickname already taken |
| 500 | Internal Server Error | Server error |

## Rate Limiting

- Registration: 5 requests per hour per IP
- Login: 10 requests per minute per IP
- API calls: 100 requests per minute per user

## Security

- All REST API calls should use HTTPS in production
- WebSocket should use WSS in production
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (12 rounds)
- Private keys never leave the client
