
import http from 'http';
import ws from 'ws';
import fetch from 'node-fetch';
import 'dotenv/config.js';

import { 
  mqttClient, 
  GW_ALARM_TOPIC, 
  GW_ALL_TOPIC,
} from './utils/mqtt.js';

import { 
  wsLogger, 
  appLogger, 
  mqttLogger,
} from './utils/logger.js';

import { sensorValidation } from './utils/validation.js';

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

mqttClient.on('message', async (topic, message) => {   
  if (topic === GW_ALL_TOPIC) {
    if (!sensorValidation(message)) return;
    
    mqttLogger.info(`[${topic}]: ${message}`);
    
    await fetch(`${process.env.API_URL}/map/v1/events/polling`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: message,
    });
  }

  if (topic === GW_ALARM_TOPIC) {
    if (!sensorValidation(message)) return;

    const alarmMessage = JSON.parse(message.toString());

    // Logic to reject alarm message when values is lower than threshold 
    if (alarmMessage.sem === 0 && alarmMessage.uis < 5) return;

    const event = await fetch(`${process.env.API_URL}/map/v1/events/alarm`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: message,
    }).then(response => response.json());

    wss.clients.forEach((client) => {
      mqttLogger.info(`[${topic}]: ${message}, ${client.id}`);
      
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(event));
      }
    });
  }
});

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
