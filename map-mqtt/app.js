import 'dotenv/config.js';

import { mqttClient } from './utils/mqtt.js';
import { wsServer } from './utils/wsServer.js';
import { appLogger } from './utils/logger.js';

wsServer.listen(3003, () => {
  appLogger.info(`Server started on port ${wsServer.address().port}`);
});

process.on('SIGINT', () => {
  mqttClient.end();
  process.exit();
});

process.on('unhandledRejection', function (err) {
  appLogger.error(`${err.message} ${err.stack}`);
}); 

process.on('uncaughtException', function (err) {
  appLogger.error(`${err.message} ${err.stack}`);
}); 
