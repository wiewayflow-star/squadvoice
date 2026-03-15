import { WSMessage, WSMessageType } from '../types';

export class SignalingProtocol {
  static createMessage(type: WSMessageType, payload: any): WSMessage {
    return {
      type,
      payload,
      timestamp: Date.now()
    };
  }

  static parseMessage(data: string): WSMessage {
    return JSON.parse(data);
  }

  static serializeMessage(message: WSMessage): string {
    return JSON.stringify(message);
  }
}
