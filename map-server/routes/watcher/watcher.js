export const getWatcher = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionWatcher } = req.app.locals;

  const result = await collectionWatcher
    .find({})
    .toArray()
    .then(result => result);

  res.json(result);
}

export const updateWatcher = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionWatcher } = req.app.locals;

  const data = JSON.parse(JSON.stringify(req.body));
  await collectionWatcher.insertOne({ data });

  res.json({ result: true });
}
