export const setEventToResolve =  async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionEvents } = req.app.locals;
  const events = JSON.parse(JSON.stringify(req.body));

  // Update current sensor to watcher
  events.map(async (event) => {
    await collectionEvents.update(
      { timestamp: event.timestamp }, 
      { 
        ...event,
        status: 'resolve', 
      },
    );
  });

  res.json({ result: true });
}
