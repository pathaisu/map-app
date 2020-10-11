import bodyParser from 'body-parser';
import getTime from 'date-fns/getTime/index.js'
import differenceInSeconds from 'date-fns/fp/differenceInSeconds/index.js'

const jsonParser = bodyParser.json();
const THRESHOLD = 60;

const eventConsumer = async (req, res) => {
  const { 
    collectionWatcher,
    collectionEvents,
 } = req.app.locals;

  let events = [];
  const timestamp = getTime(new Date());
  const queryTimestamp = req.query.timestamp;

  if (queryTimestamp) {
    events = await collectionEvents
      .find({ timestamp: { $gte: `${queryTimestamp}` } })
      .toArray()
      .then(result => result);
  }

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

  // Create invalid watcher
  for (const sensor of invalidWatcher) {
    delete sensor._id;
  
    const event = {
      eventType: 'polling',
      reason: 'too long since last node',
      timestamp: `${timestamp}`,
      sensor,
    }

    events.push(event);
    // await collectionEvents.insertOne({ ...event });
  }

  res.json(events);
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
    sensor: {
      ...sensor,
      timestamp: `${timestamp}`,
    },
  }

  console.log(event);

  await collectionSensors.insertOne({ ...sensor });
  await collectionEvents.insertOne({ ...event });

  res.json({ result: true });
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
        sensor,
      }
    
      await collectionEvents.insertOne({ ...event });
    }
  }

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

export default (app) => {
  app.get('/map/v1/events', 
    (req, res) => eventConsumer(req, res),
  );
  app.post('/map/v1/events/polling', 
    jsonParser,
    (req, res) => pollingEventProducer(req, res),
  );
  app.post('/map/v1/events/alarm', 
    jsonParser,
    (req, res) => alarmEventProducer(req, res),
  );
} 
