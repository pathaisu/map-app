import mongodb from 'mongodb';
import {
  DB_URI,
  DB_NAME,
  COLLECTION_SENSORS,
  COLLECTION_EVENTS,
  COLLECTION_WATCHER,
} from '../config/index.js';

export const setMongo = async (app) => {
  const client = await mongodb.MongoClient
    .connect(DB_URI, { useNewUrlParser: true, poolSize: 10 })
    .then(client => client);
  
  const db = client.db(DB_NAME);
  
  app.locals.db = db;
  app.locals.collectionSensors = db.collection(COLLECTION_SENSORS);
  app.locals.collectionEvents = db.collection(COLLECTION_EVENTS);
  app.locals.collectionWatcher = db.collection(COLLECTION_WATCHER);

  /* listen for the signal interruption (ctrl-c) */
  process.on('SIGINT', () => {
    app.locals.db.close();
    process.exit();
  });
}