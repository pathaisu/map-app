import cron from 'cron';
import { appLogger } from './utils/logger.js';
import { getEvents } from './apis/httpRequest.js';

const POLLING_TIME = process.env.POLLING_TIME;

let queryTime = `${Date.now() - POLLING_TIME}`;

const cb = async () => {
  appLogger.info(`Polling every ${POLLING_TIME/1000} sec`);

  const { timestamp } = await getEvents(queryTime);
  queryTime = timestamp;
}

const job = new cron.CronJob(`*/${POLLING_TIME/1000} * * * * *`, cb, null, true, 'America/Los_Angeles');

job.start();
