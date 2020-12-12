import bodyParser from 'body-parser';
import { getWatcher, updateWatcher } from './watcher.js';


const jsonParser = bodyParser.json();

export default (app) => {
  app.get('/map/v1/watcher', (req, res) => getWatcher(req, res));
  app.post('/map/v1/watcher', 
    jsonParser,
    (req, res) => updateWatcher(req, res)
  );
} 
