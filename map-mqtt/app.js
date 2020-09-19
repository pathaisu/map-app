
import http from 'http';
import ws from 'ws';
import 'dotenv/config.js';

import { mqttClient, ALARM_TOPIC } from './utils/mqtt.js';
import { wsLogger, appLogger } from './utils/logger.js';

const wss = new ws.Server({
  noServer: true,
});

const onSocketConnect = (wsClient) => {
  wsLogger.info('wss connected');

  wsClient.on('message', function(message) {
    wsLogger.info(JSON.stringify(message));
    wsClient.send(JSON.stringify(message)) 
  });

  wsClient.on('close', () => {
    wsLogger.info('close connection');
  });

  mqttClient.on('message', async (topic, message) => {    
    if (topic === ALARM_TOPIC) {
      wsLogger.info(`[${topic}]: ${message}`);
      wsClient.send(JSON.stringify(JSON.parse(message)));
    }
  });
}

const server = new http.createServer((req, _) => {
  // here we only handle websocket connections
  // in real project we'd have some other code here to handle non-websocket requests
  wss.handleUpgrade(
    req, 
    req.socket, 
    Buffer.alloc(0), 
    onSocketConnect
  );
});

server.listen(3003, () => {
  appLogger.info(`Server started on port ${server.address().port}`);
});

process.on('SIGINT', () => {
  mqttClient.end();
  process.exit();
});

process.on('uncaughtException', (err) => {
  appLogger.error(err);
}); 
