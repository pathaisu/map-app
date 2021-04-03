import 'dotenv/config.js';

import { mqttClient } from './utils/mqtt.js';
import { server } from './utils/server.js';
import { appLogger } from './utils/logger.js';

server.listen(3003, () => {
  appLogger.info(`Server started on port ${server.address().port}`);
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
