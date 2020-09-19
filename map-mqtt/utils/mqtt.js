import fetch from 'node-fetch'
import MQTT from 'async-mqtt';
import 'dotenv/config.js';

import { mqttLogger } from './logger.js';

export const ALARM_TOPIC = 'alarm';
export const POLLING_TOPIC = 'polling';

export const mqttClient = MQTT.connect(process.env.MQTT_URL);

const onConnectHandler = async () => {
  mqttLogger.info('MQTT connected');

	try {
    await mqttClient.subscribe(POLLING_TOPIC, function (err) {
      if (!err) {
        mqttLogger.info('Subscribe polling success');
      }
    });

    await mqttClient.subscribe(ALARM_TOPIC, function (err) {
      if (!err) {
        mqttLogger.info('Subscribe alarm success');
      }
    });
        
	} catch (e){
		mqttLogger.error(e.stack);
		process.exit();
	}
}

const onMessageHandler = async (topic, message) => {  
  if (topic === ALARM_TOPIC) {
    mqttLogger.info(`[${topic}]: ${message}`);

    await fetch(`${process.env.API_URL}/map/v1/events/alarm`, {
      method: 'post',
      body: message,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (topic === POLLING_TOPIC) {
    mqttLogger.info(`[${topic}]: ${message}`);
    
    await fetch(`${process.env.API_URL}/map/v1/events/polling`, {
      method: 'post',
      body: message,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

mqttClient.on('connect', onConnectHandler);
mqttClient.on('message', onMessageHandler);
