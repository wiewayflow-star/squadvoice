import WebSocket from 'ws';
import { verifyToken } from '../auth/auth';

type WSMessageType = 'register' | 'login' | 'join_channel' | 'leave_channel' | 'signal' | 'ice_candidate' | 'peer_joined' | 'peer_left' | 'error';
interface WSMessage { type: WSMessageType; payload: any; timestamp: number; }
const parseMessage = (data: string): WSMessage => JSON.parse(data);
const createMessage = (type: WSMessageType, payload: any): WSMessage => ({ type, payload, timestamp: Date.now() });
const serializeMessage = (msg: WSMessage): string => JSON.stringify(msg);

export interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  nickname?: string;
  isAlive?: boolean;
}

export class SignalingServer {
  private wss: WebSocket.Server;
  private clients: Map<string, AuthenticatedWebSocket> = new Map();
  private channelMembers: Map<string, Set<string>> = new Map();

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.setupServer();
    console.log(`WebSocket server listening on port ${port}`);
  }

  private setupServer() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket) => {
      console.log('New WebSocket connection');
      ws.isAlive = true;

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (data: string) => {
        this.handleMessage(ws, data);
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
    });

    // Heartbeat to detect dead connections
    setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  private async handleMessage(ws: AuthenticatedWebSocket, data: string) {
    try {
      const message: WSMessage = parseMessage(data);

      switch (message.type) {
        case 'login':
          await this.handleLogin(ws, message.payload);
          break;
        case 'join_channel':
          await this.handleJoinChannel(ws, message.payload);
          break;
        case 'leave_channel':
          await this.handleLeaveChannel(ws, message.payload);
          break;
        case 'signal':
          await this.handleSignal(ws, message.payload);
          break;
        case 'ice_candidate':
          await this.handleIceCandidate(ws, message.payload);
          break;
        default:
          this.sendError(ws, 'Unknown message type');
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.sendError(ws, 'Invalid message format');
    }
  }

  private async handleLogin(ws: AuthenticatedWebSocket, payload: any) {
    const { token } = payload;
    const auth = verifyToken(token);

    if (!auth) {
      this.sendError(ws, 'Invalid token');
      return;
    }

    ws.userId = auth.userId;
    ws.nickname = auth.nickname;
    this.clients.set(auth.userId, ws);

    this.send(ws, 'login', { success: true, userId: auth.userId });
    console.log(`User ${auth.nickname} authenticated`);
  }

  private async handleJoinChannel(ws: AuthenticatedWebSocket, payload: any) {
    if (!ws.userId) {
      this.sendError(ws, 'Not authenticated');
      return;
    }

    const { channelId } = payload;
    
    if (!this.channelMembers.has(channelId)) {
      this.channelMembers.set(channelId, new Set());
    }

    const members = this.channelMembers.get(channelId)!;
    
    // Notify existing members about new peer
    members.forEach(memberId => {
      const memberWs = this.clients.get(memberId);
      if (memberWs) {
        this.send(memberWs, 'peer_joined', {
          peerId: ws.userId,
          nickname: ws.nickname,
          channelId
        });
      }
    });

    // Send existing members to new peer
    const existingMembers = Array.from(members).map(id => ({
      peerId: id,
      nickname: this.clients.get(id)?.nickname
    }));

    this.send(ws, 'join_channel', {
      channelId,
      members: existingMembers
    });

    members.add(ws.userId);
  }

  private async handleLeaveChannel(ws: AuthenticatedWebSocket, payload: any) {
    if (!ws.userId) return;

    const { channelId } = payload;
    const members = this.channelMembers.get(channelId);

    if (members) {
      members.delete(ws.userId);
      
      // Notify other members
      members.forEach(memberId => {
        const memberWs = this.clients.get(memberId);
        if (memberWs) {
          this.send(memberWs, 'peer_left', {
            peerId: ws.userId,
            channelId
          });
        }
      });
    }
  }

  private async handleSignal(ws: AuthenticatedWebSocket, payload: any) {
    if (!ws.userId) {
      this.sendError(ws, 'Not authenticated');
      return;
    }

    const { to, sdp } = payload;
    const targetWs = this.clients.get(to);

    if (!targetWs) {
      this.sendError(ws, 'Target peer not found');
      return;
    }

    this.send(targetWs, 'signal', {
      from: ws.userId,
      sdp
    });
  }

  private async handleIceCandidate(ws: AuthenticatedWebSocket, payload: any) {
    if (!ws.userId) return;

    const { to, candidate } = payload;
    const targetWs = this.clients.get(to);

    if (targetWs) {
      this.send(targetWs, 'ice_candidate', {
        from: ws.userId,
        candidate
      });
    }
  }

  private handleDisconnect(ws: AuthenticatedWebSocket) {
    if (!ws.userId) return;

    console.log(`User ${ws.nickname} disconnected`);
    
    // Remove from all channels
    this.channelMembers.forEach((members, channelId) => {
      if (members.has(ws.userId!)) {
        members.delete(ws.userId!);
        
        // Notify other members
        members.forEach(memberId => {
          const memberWs = this.clients.get(memberId);
          if (memberWs) {
            this.send(memberWs, 'peer_left', {
              peerId: ws.userId,
              channelId
            });
          }
        });
      }
    });

    this.clients.delete(ws.userId);
  }

  private send(ws: WebSocket, type: string, payload: any) {
    const message = createMessage(type as WSMessageType, payload);
    ws.send(serializeMessage(message));
  }

  private sendError(ws: WebSocket, error: string) {
    this.send(ws, 'error', { error });
  }
}
