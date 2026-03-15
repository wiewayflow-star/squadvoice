import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './api/routes';
import { SignalingServer } from './websocket/server';

dotenv.config();

const PORT = parseInt(process.env.PORT || '8080');
const WS_PORT = parseInt(process.env.WS_PORT || '8081');

// HTTP API Server
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`HTTP API server listening on port ${PORT}`);
});

// WebSocket Signaling Server
new SignalingServer(WS_PORT);

console.log('SquadVoice Signal Server started');
console.log(`HTTP API: http://localhost:${PORT}`);
console.log(`WebSocket: ws://localhost:${WS_PORT}`);
