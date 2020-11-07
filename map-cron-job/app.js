import cron from 'cron';
import { getEvents } from './apis/httpRequest.js';

const POLLING_TIME = 30000;

let queryTime = `${Date.now() - POLLING_TIME}`;

const cb = async () => {
  console.log(`You will see this message every ${POLLING_TIME/1000}`);

  const { timestamp } = await getEvents(queryTime);
  queryTime = timestamp;
}

const job = new cron.CronJob(`*/${POLLING_TIME/1000} * * * * *`, cb, null, true, 'America/Los_Angeles');

job.start();
