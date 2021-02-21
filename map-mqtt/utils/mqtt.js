import MQTT from 'async-mqtt';
import 'dotenv/config.js';

import { mqttLogger } from './logger.js';

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
	} catch (e){
		mqttLogger.error(e.stack);
		process.exit();
	}
}

mqttClient.on('connect', onConnectHandler);

export { mqttClient };
