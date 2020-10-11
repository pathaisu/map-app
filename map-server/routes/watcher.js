import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const getWatcher = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionWatcher } = req.app.locals;

  const result = await collectionWatcher
    .findOne({})
    .then(result => result);

  res.json(result);
}

const updateWatcher = async (req, res) => {
  // Get mongo client from req.app.locals
  const { collectionWatcher } = req.app.locals;

  const data = JSON.parse(JSON.stringify(req.body));
  await collectionWatcher.insertOne({ data });

  res.json({ result: true });
}

export default (app) => {
  app.get('/map/v1/watcher', (req, res) => getWatcher(req, res));
  app.post('/map/v1/watcher', 
    jsonParser,
    (req, res) => updateWatcher(req, res)
  );
} 
