import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const getSensors = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionSensors } = req.app.locals;

  const result = await collectionSensors
    .findOne({})
    .then(result => result);

  res.json(result);
}

const insertSensor = async (req, res) => {
  // Get mongo client from req.app.locals
  // await collectionSensors.insertOne(mockSensors);
  const { collectionSensors } = req.app.locals;

  const data = JSON.parse(JSON.stringify(req.body));
  await collectionSensors.insertOne({ data });

  res.json({ result: true });
}

export default (app) => {
  app.get('/map/v1/sensors', (req, res) => getSensors(req, res));
  app.post('/map/v1/sensors', 
    jsonParser,
    (req, res) => insertSensor(req, res)
  );
} 
