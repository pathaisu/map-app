import getTime from 'date-fns/getTime/index.js';
import differenceInSeconds from 'date-fns/fp/differenceInSeconds/index.js';

const THRESHOLD = process.env.THRESHOLD;
const EVENT_MESSAGE = {
  alarm: 'invade',
  polling: 'too long since last node',
}

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

const updateEvent = async (req, eventType, sensor, timestamp) => {
  const { collectionEvents } = req.app.locals;

  const event = {
    eventType,
    reason: EVENT_MESSAGE[eventType],
    timestamp: `${timestamp}`,
    status: 'not_resolve',
    sensor: {
      ...sensor,
      timestamp: `${timestamp}`,
    },
  }

  await collectionEvents.insertOne({ ...event });

  return event;
}

const shouldProduceNewPollingEvent = (watcher, timestamp) => differenceInSeconds(
  getTime(parseInt(watcher.timestamp)),
  getTime(timestamp),
) < THRESHOLD;

export const alarmEventProducer = async (req, res) => {
  const { sensor, timestamp } = await updateSensor(req);
  await updateWatcher(req, sensor, timestamp);
  
  const event = updateEvent(req, 'alarm', sensor, timestamp);

  res.json(event);
}

export const pollingEventProducer = async (req, res) => {
  const { sensor, timestamp } = await updateSensor(req);
  await updateWatcher(req, sensor, timestamp);

  const { collectionWatcher } = req.app.locals;

  // Generate new event if last sensor timestamp is longer than THRESHOLD
  const watcher = await collectionWatcher.findOne({ id: sensor.id });

  if (!watcher) return res.json({ result: 'no watcher found' });
  if (!shouldProduceNewPollingEvent(watcher, timestamp)) return res.json({ result: 'no need to generate event' });

  const event = updateEvent(req, 'polling', sensor, timestamp);

  res.json(event);
}
