import getTime from 'date-fns/getTime/index.js';
import { alarmEventProducer } from './producer.js';

const updateSensor = async (req) => {
  const { collectionSensors } = req.app.locals;

  const sensor = JSON.parse(JSON.stringify(req.body));
  const timestamp = getTime(new Date());

  await collectionSensors.insertOne({ ...sensor });

  return { sensor, timestamp };
}

// Update current sensor to watcher
const updateWatcher = async (req, sensor, timestamp) => {
  const { collectionWatcher } = req.app.locals;

  await collectionWatcher.update(
    { id: sensor.id }, 
    { 
      ...sensor,
      timestamp: `${timestamp}`,
    },
    { upsert: true }
  );
}

export const alarmSignalHandler = async (req, res) => {
  const { sensor, timestamp } = await updateSensor(req);

  await updateWatcher(req, sensor, timestamp);

  const event = await alarmEventProducer(req, 'alarm', sensor, timestamp);

  res.json(event);
}

export const pollingSignalHandler = async (req, res) => {
  const { sensor, timestamp } = await updateSensor(req);

  await updateWatcher(req, sensor, timestamp);

  res.json({ result: true });
}
