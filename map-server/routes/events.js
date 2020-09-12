import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const getEvents = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionEvents } = req.app.locals;

  const result = await collectionEvents
  .findOne({})
  .then(result => result);

  res.json(result);
}

const pollingEventProducer = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionEvents } = req.app.locals;

  const sensors = JSON.parse(JSON.stringify(req.body));
  const event = {
    eventType: 'polling',
    reason: 'routine',
    timestamp: new Date().getTime(),
    sensors,
  }

  await collectionEvents.insertOne({ ...event });

  res.json({ result: true });
}

export default (app) => {
  app.get('/map/v1/events', (req, res) => getEvents(req, res));
  app.post('/map/v1/events/polling', 
    jsonParser,
    (req, res) => pollingEventProducer(req, res),
  );
} 
