import ws from 'ws';
import http from 'http';

import { wsLogger } from './logger.js';
import { addAlarmEvent } from './api.js'; 

const CLIENTS = [];
const wss = new ws.Server({
  noServer: true,
});

const getUid = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

const onSocketConnect = (wsClient) => {
  wsLogger.info('wss connected');

  wsClient.on('message', function(message) {
    wsLogger.info(JSON.stringify(message));
    wsClient.send(JSON.stringify(message));
  });

  wsClient.on('close', () => {
    wsLogger.info('close connection');
  });

  wsClient.id = getUid();

  CLIENTS.push(wsClient);
}

export const alarmToClient = async (topic, message) => {
  const event = await addAlarmEvent(message);
  
  wss.clients.forEach((client) => {
    wsLogger.info(`[${topic}]: ${message}, ${client.id}`);
    
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
}

export const server = new http.createServer((req, _) => {
  // here we only handle websocket connections
  // in real project we'd have some other code here to handle non-websocket requests
  wss.handleUpgrade(
    req, 
    req.socket, 
    Buffer.alloc(0), 
    onSocketConnect
  );
});
