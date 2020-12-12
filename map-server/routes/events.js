import bodyParser from 'body-parser';
import getTime from 'date-fns/getTime/index.js';
import differenceInSeconds from 'date-fns/fp/differenceInSeconds/index.js';

const jsonParser = bodyParser.json();
const THRESHOLD = 60;

const eventConsumer = async (req, res) => {
  const { collectionEvents } = req.app.locals;

  let events = [];
  let timestamp = getTime(new Date());
  const queryTimestamp = req.query.timestamp;

  // Query for events that haven't display on UI yet
  if (queryTimestamp) {
    events = await collectionEvents
      .find({ 
        $and: [
          { timestamp: { $gt: `${queryTimestamp}` } },
          { timestamp: { $ne: `${queryTimestamp}` } },
        ]
      })
      .toArray()
      .then(result => result);
  }

  res.json({
    timestamp,
    events,
  });
}

const eventProducer = async (req, res) => {
  const { 
    collectionWatcher,
    collectionEvents,
 } = req.app.locals;

  let timestamp = getTime(new Date());
  
  // 1. Find existing watcher then filter for invalid sensors (sensors that last timestamp is longer than THRESHOLD)
  const watcher = await collectionWatcher
    .find({})
    .toArray()
    .then(result => result);

  const invalidWatcher = watcher.filter(data => {
    const diffTime = differenceInSeconds(
      getTime(+data.timestamp),
      getTime(timestamp),
    );

    return diffTime > THRESHOLD;
  });

  // 2. Convert invalid watcher into new events then insert them to events collection
  for (const sensor of invalidWatcher) {
    timestamp = getTime(new Date());

    delete sensor._id;
  
    const event = {
      eventType: 'polling',
      reason: 'too long since last node',
      timestamp: `${timestamp}`,
      status: 'not_resolve',
      sensor,
    }

    await collectionEvents.insertOne({ ...event });
  }

  res.json({ timestamp });
}

const alarmEventProducer = async (req, res) => {
  // Get mongo client from req.app.locals
  const { 
    collectionEvents, 
    collectionSensors, 
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

  res.json(event);
}

const pollingEventProducer = async (req, res) => {
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

const setEventToResolve =  async (req, res) => {
  // Get mongo client from req.app.locals
  const { 
    collectionEvents,
  } = req.app.locals;

  const event = JSON.parse(JSON.stringify(req.body));

  // Update current sensor to watcher
  await collectionEvents.update(
    { timestamp: event.timestamp }, 
    { 
      ...event,
      status: 'resolve', 
    },
  );

  res.json({ result: true });
}

export default (app) => {
  app.get('/map/v1/events', 
    (req, res) => eventConsumer(req, res),
  );
  app.get('/map/v1/events/producer', 
    (req, res) => eventProducer(req, res),
  );
  app.post('/map/v1/events/polling', 
    jsonParser,
    (req, res) => pollingEventProducer(req, res),
  );
  app.post('/map/v1/events/alarm', 
    jsonParser,
    (req, res) => alarmEventProducer(req, res),
  );
  app.post('/map/v1/events/resolve', 
    jsonParser,
    (req, res) => setEventToResolve(req, res),
  );
} 
