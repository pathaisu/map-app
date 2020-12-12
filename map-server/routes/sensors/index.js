import bodyParser from 'body-parser';
import { getSensors, insertSensor } from './sensors.js';

const jsonParser = bodyParser.json();

export default (app) => {
  app.get('/map/v1/sensors', (req, res) => getSensors(req, res));
  app.post('/map/v1/sensors', 
    jsonParser,
    (req, res) => insertSensor(req, res)
  );
} 
