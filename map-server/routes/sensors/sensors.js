export const getSensors = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionSensors } = req.app.locals;

  const result = await collectionSensors
    .findOne({})
    .then(result => result);

  res.json(result);
}

export const insertSensor = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionSensors } = req.app.locals;

  const data = JSON.parse(JSON.stringify(req.body));
  await collectionSensors.insertOne({ data });

  res.json({ result: true });
}
