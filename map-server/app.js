import express from 'express';
import cors from 'cors';
import { setRoutes } from './routes/index.js';
import { setMongo } from './mongo/setup.js';
import { appLogger } from './utils/logger.js';
import { PORT } from './config/index.js'

const app = express();

app.use(cors());
setMongo(app);
setRoutes(app);

app.listen(PORT, () => {
  appLogger.info(`API is now active on port ${PORT}`);
});
