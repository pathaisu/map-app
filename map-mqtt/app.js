
import http from 'http';
import ws from 'ws';
import fetch from 'node-fetch';
import 'dotenv/config.js';

import { mqttClient, GW_ALARM_TOPIC } from './utils/mqtt.js';
import { wsLogger, appLogger, mqttLogger } from './utils/logger.js';

const wss = new ws.Server({
  noServer: true,
});

const onSocketConnect = (wsClient) => {
  wsLogger.info('wss connected');

  wsClient.on('message', function(message) {
    wsLogger.info(JSON.stringify(message));
    wsClient.send(JSON.stringify(message));
  });

  wsClient.on('close', () => {
    wsLogger.info('close connection');
  });

  mqttClient.on('message', async (topic, message) => {    
    if (topic === GW_ALARM_TOPIC) {
      mqttLogger.info(`[${topic}]: ${message}`);

      const event = await fetch(`${process.env.API_URL}/map/v1/events/alarm`, {
        method: 'post',
        body: message,
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json());

      wsLogger.info(`[${topic}]: ${event}`);
      wsClient.send(JSON.stringify(event));
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
