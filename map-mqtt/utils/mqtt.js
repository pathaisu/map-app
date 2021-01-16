import fetch from 'node-fetch'
import MQTT from 'async-mqtt';
import 'dotenv/config.js';

import { mqttLogger } from './logger.js';

export const ALARM_TOPIC = 'alarm';
export const POLLING_TOPIC = 'polling';
export const GW_ALL_TOPIC = '/gw/all';
export const GW_ALARM_TOPIC = '/gw/alarm';

const mqttClient = MQTT.connect(process.env.MQTT_URL);

const onConnectHandler = async () => {
  mqttLogger.info('MQTT connected');

	try {
    await mqttClient.subscribe(GW_ALL_TOPIC, function (err) {
      if (!err) {
        mqttLogger.info('Subscribe polling success');
      }
    });

    await mqttClient.subscribe(GW_ALARM_TOPIC, function (err) {
      if (!err) {
        mqttLogger.info('Subscribe alarm success');
      }
    });

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

  if (topic === GW_ALL_TOPIC) {
    mqttLogger.info(`[${topic}]: ${message}`);

    await fetch(`${process.env.API_URL}/map/v1/events/polling`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: message,
    });
  }
}

mqttClient.on('connect', onConnectHandler);
mqttClient.on('message', onMessageHandler);

export { mqttClient };
