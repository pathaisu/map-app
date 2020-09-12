import { mockArea } from './__fixtures__/sensors.js';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const getAreas = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionAreas } = req.app.locals;

  const result = await collectionAreas
    .findOne({})
    .then(result => result);

  res.json(result);
}


const insertArea = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionAreas } = req.app.locals;

  await collectionAreas.insertOne({ ...mockArea });

  res.json({ result: true });
}

export default (app) => {
  app.get('/map/v1/areas', (req, res) => getAreas(req, res));
  app.post('/map/v1/areas',
    jsonParser,
    (req, res) => insertArea(req, res),
  );
} 
