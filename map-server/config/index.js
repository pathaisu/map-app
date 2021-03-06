import {
  DB_URI as DEFAULT_DB_URI,
  DB_NAME as DEFAULT_DB_NAME,
  COLLECTION_SENSORS as DEFAULT_COLLECTION_SENSORS,
  COLLECTION_EVENTS as DEFAULT_COLLECTION_EVENTS,
  COLLECTION_WATCHER as DEFAULT_COLLECTION_WATCHER,
} from './db.js';

const DB_URI = process.env.DEFAULT_DB_URI ? process.env.DB_URI: DEFAULT_DB_URI;
const DB_NAME = process.env.DEFAULT_DB_NAME ? process.env.DB_NAME: DEFAULT_DB_NAME;
const COLLECTION_SENSORS = process.env.COLLECTION_SENSORS ? process.env.COLLECTION_SENSORS: DEFAULT_COLLECTION_SENSORS;
const COLLECTION_EVENTS = process.env.COLLECTION_EVENTS ? process.env.COLLECTION_EVENTS: DEFAULT_COLLECTION_EVENTS;
const COLLECTION_WATCHER = process.env.COLLECTION_WATCHER ? process.env.COLLECTION_WATCHER: DEFAULT_COLLECTION_WATCHER;

export {
  DB_URI,
  DB_NAME,
  COLLECTION_SENSORS,
  COLLECTION_EVENTS,
  COLLECTION_WATCHER,
};

export const PORT = process.env.PORT ? process.env.PORT : 3002;
