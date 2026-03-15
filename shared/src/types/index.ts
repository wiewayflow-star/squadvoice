// User types
export interface User {
  id: string;
  nickname: string;
  displayName: string;
  publicKey: string;
  avatarHash?: string;
  telegramId?: number;
  createdAt: Date;
}

export interface UserRegistration {
  nickname: string;
  password: string;
  publicKey: string;
  displayName: string;
  avatarHash?: string;
}

// Server types
export interface Server {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: 'voice' | 'text';
  createdAt: Date;
}

export type Role = 'owner' | 'admin' | 'moderator' | 'user' | 'guest';

export interface ServerMember {
  serverId: string;
  userId: string;
  role: Role;
  joinedAt: Date;
}

// WebSocket message types
export type WSMessageType =
  | 'register'
  | 'login'
  | 'join_channel'
  | 'leave_channel'
  | 'signal'
  | 'ice_candidate'
  | 'peer_joined'
  | 'peer_left'
  | 'error';

export interface WSMessage {
  type: WSMessageType;
  payload: any;
  timestamp: number;
}

// Signaling types
export interface SignalMessage {
  from: string;
  to: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

// Voice types
export interface VoiceConfig {
  codec: 'opus';
  sampleRate: 48000;
  channels: 1;
  bitrate: number; // 16000-32000
  frameSize: 20;
}

export interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  audioStream?: MediaStream;
  dataChannel?: RTCDataChannel;
}

// Crypto types
export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export interface PreKeyBundle {
  identityKey: Uint8Array;
  signedPreKey: Uint8Array;
  oneTimePreKey?: Uint8Array;
  signature: Uint8Array;
}
