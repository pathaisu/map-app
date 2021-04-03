import getTime from 'date-fns/getTime/index.js';
import differenceInSeconds from 'date-fns/fp/differenceInSeconds/index.js';


const THRESHOLD = process.env.THRESHOLD;

export const alarmEventProducer = async (req, res) => {
  // Get mongo client from req.app.locals
  const { 
    collectionEvents, 
    collectionSensors, 
    collectionWatcher,
  } = req.app.locals;

  const timestamp = getTime(new Date());
  const sensor = JSON.parse(JSON.stringify(req.body));

  const event = {
    eventType: 'alarm',
    reason: 'invade',
    timestamp: `${timestamp}`,
    status: 'not_resolve',
    sensor: {
      ...sensor,
      timestamp: `${timestamp}`,
    },
  }

  await collectionSensors.insertOne({ ...sensor });
  await collectionEvents.insertOne({ ...event });

  // Update current sensor to watcher
  await collectionWatcher.update(
    { id: sensor.id }, 
    { 
      ...sensor,
      timestamp: `${timestamp}`,
    },
    { upsert: true }
  );

  res.json(event);
}

export const pollingEventProducer = async (req, res) => {
  // Get mongo client from req.app.locals
  const { 
    collectionEvents, 
    collectionSensors, 
    collectionWatcher,
  } = req.app.locals;

  const sensor = JSON.parse(JSON.stringify(req.body));
  const timestamp = getTime(new Date());

  await collectionSensors.insertOne({ 
    ...sensor,
    timestamp: `${timestamp}`,
  });

  // Generate new event if last sensor timestamp is longer than THRESHOLD
  const watcher = await collectionWatcher.findOne({ id: sensor.id });

  if (watcher) { 
    const diffTime = differenceInSeconds(
      getTime(+watcher.timestamp),
      getTime(timestamp),
    );

    if (diffTime > THRESHOLD) {
      const event = {
        eventType: 'polling',
        reason: 'too long since last node',
        timestamp: `${timestamp}`,
        status: 'not_resolve',
        sensor,
      }
    
      await collectionEvents.insertOne({ ...event });
    }
  }

  // Update current sensor to watcher
  await collectionWatcher.update(
    { id: sensor.id }, 
    { 
      ...sensor,
      timestamp: `${timestamp}`,
    },
    { upsert: true }
  );

  res.json({ result: true });
}
