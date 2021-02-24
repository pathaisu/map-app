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
  // For front-end to fetch events 
  app.get('/map/v1/events/consumer', 
    (req, res) => eventConsumer(req, res),
  );
  // For corn-job to fetch & generate new events.
  app.post('/map/v1/events/producer', 
    (req, res) => eventProducer(req, res),
  );
  // To generate new polling event
  app.post('/map/v1/events/polling', 
    jsonParser,
    (req, res) => pollingEventProducer(req, res),
  );
  // To generate new alarm event
  app.post('/map/v1/events/alarm', 
    jsonParser,
    (req, res) => alarmEventProducer(req, res),
  );
  // To update status of event to resolved
  app.post('/map/v1/events/resolve', 
    jsonParser,
    (req, res) => setEventToResolve(req, res),
  );
} 
