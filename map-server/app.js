import express from 'express';
import cors from 'cors';
import { setRoutes } from './routes/index.js';
import { setMongo } from './mongo/setup.js';


const app = express();

app.use(cors());
setMongo(app);
setRoutes(app);

app.listen(3002, () => {
  console.log('API is now active on port 3002')
});
