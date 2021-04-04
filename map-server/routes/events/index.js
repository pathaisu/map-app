import bodyParser from 'body-parser';

import { eventConsumer } from './handlers/consumer.js';
import { missingSensorsEventProducer } from './handlers/producer.js';
import { setEventToResolve } from './handlers/resolve.js';
import { 
  alarmSignalHandler,
  pollingSignalHandler,
} from './handlers/events.js';

const jsonParser = bodyParser.json();

export default (app) => {
  /**
   * To: fetch events by timestamp
   * For: => front-end
   */
  app.get('/map/v1/events/consumer', (req, res) => eventConsumer(req, res));

  /**
   * To: fetch events
   * To: generate new events
   * For: => corn-job
   */
  app.post('/map/v1/events/producer', (req, res) => missingSensorsEventProducer(req, res));

  /**
   * To: generate new polling event
   * For: => mqtt-service/utils/api
   */
  app.post('/map/v1/events/polling', 
    jsonParser,
    (req, res) => pollingSignalHandler(req, res),
  );

  /**
   * To: generate new alarm event
   * For: => mqtt-service/utils/api
   */ 
  app.post('/map/v1/events/alarm', 
    jsonParser,
    (req, res) => alarmSignalHandler(req, res),
  );

  /** 
   * To: update status of event to resolved
   * For: => front-end to resolved event
   */
  app.post('/map/v1/events/resolve', 
    jsonParser,
    (req, res) => setEventToResolve(req, res),
  );
} 
