import getTime from 'date-fns/getTime/index.js';
import differenceInSeconds from 'date-fns/fp/differenceInSeconds/index.js';

const THRESHOLD = process.env.THRESHOLD;

/**
 * 1. Find existing watcher then filter for invalid sensors (sensors that last timestamp is longer than THRESHOLD)
 */
const getInvalidWatchers = async (collectionWatcher) => {
  const currentTimestamp = getTime(new Date());
  const watcher = await collectionWatcher
    .find({})
    .toArray();

  // Filter to find sensors that last timestamp is longer than THRESHOLD
  const filterTooLongWatchers = (data) => differenceInSeconds(
    getTime(parseInt(data.timestamp)),
    getTime(currentTimestamp),
  ) > THRESHOLD;
    
  return watcher.filter(filterTooLongWatchers);
}

/** 
 * 2. Convert invalid watcher into new events then insert them to events collection
 */
const createNewPollingEvent = async (collectionEvents, invalidWatchers) => {
  let timestamp = getTime(new Date());

  if (!invalidWatchers.length) return timestamp;

  const promises = invalidWatchers.map(async (sensor) => {
    // To generate unique timestamp
    timestamp = getTime(new Date());

    // Some times payload contains `_id` but this property is not necessary for generating new event.
    delete sensor._id;
  
    await collectionEvents.insertOne({
      eventType: 'polling',
      reason: 'too long since last node',
      timestamp: `${timestamp}`,
      status: 'not_resolve',
      sensor,
    });
  });

  await Promise.all(promises);

  return timestamp;
}

export const eventProducer = async (req, res) => {
  const { 
    collectionWatcher,
    collectionEvents,
  } = req.app.locals;

  const invalidWatchers = await getInvalidWatchers(collectionWatcher);
  const latestTimestamp = await createNewPollingEvent(
    collectionEvents, 
    invalidWatchers
  );

  res.json({ timestamp: latestTimestamp });
}
