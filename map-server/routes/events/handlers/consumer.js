import getTime from 'date-fns/getTime/index.js';

export const eventConsumer = async (req, res) => {
  const { collectionEvents } = req.app.locals;

  const timestamp = getTime(new Date());
  const queryTimestamp = req.query.timestamp;

  if (!queryTimestamp) {
    res.json({ 
      timestamp,
      events: [],
    });
  }

  // Query for events that haven't display on UI yet
  const events = await collectionEvents
    .find({ 
      $and: [
        { timestamp: { $gt: `${queryTimestamp}` } },
        { timestamp: { $ne: `${queryTimestamp}` } },
      ]
    })
    .toArray()
    .then(result => result);

  res.json({ 
    timestamp,
    events,
  });
}
