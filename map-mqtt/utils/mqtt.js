import MQTT from 'async-mqtt';
import 'dotenv/config.js';

import { addPollingEvent } from './api.js';
import { alarmToClient } from './wsServer.js';
import { mqttLogger } from './logger.js';
import { sensorValidation } from './validation.js';

export const GW_ALL_TOPIC = '/gw/all';
export const GW_ALARM_TOPIC = '/gw/alarm';

const isMessageCorruption = (topic, message) => {
  mqttLogger.info(`[${topic}]: ${message}`);

  if (!sensorValidation(message)) {
    mqttLogger.error(`[${topic}-corrupted]: ${message}`);
    return false;
  }

  return true;
}

const shouldAlarmToClient = (message) => {
  const alarmMessage = JSON.parse(message.toString());
  
  // Logic to reject alarm message when values is lower than threshold 
  if (alarmMessage.sem === 0 && alarmMessage.uis < 5) return false;
  
  return true;
} 

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
	} catch (e){
		mqttLogger.error(e.stack);
		process.exit();
	}
}

const onMessageHandler = async (topic, message) => {   
  try {
    if (topic === GW_ALL_TOPIC) {
      if (!isMessageCorruption(topic, message)) return;
  
      await addPollingEvent(message);
    }
  
    if (topic === GW_ALARM_TOPIC) {
      if (!isMessageCorruption(topic, message)) return;
      if (!shouldAlarmToClient(message)) return;
  
      await alarmToClient(topic, message);
    }
  } catch (e) {
    mqttLogger.error(e.stack);
		process.exit();
  }
}

const mqttClient = MQTT.connect(process.env.MQTT_URL);

mqttClient.on('connect', onConnectHandler);
mqttClient.on('message', onMessageHandler);

export { mqttClient };
