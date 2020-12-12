import bodyParser from 'body-parser';
import { 
  eventConsumer,
  eventProducer,
  pollingEventProducer,
  alarmEventProducer,
  setEventToResolve,
} from './events.js';


const jsonParser = bodyParser.json();

export default (app) => {
  app.get('/map/v1/events/consumer', 
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
