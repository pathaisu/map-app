import setSensorsRoutes from './sensors/index.js';
import setUsersRoutes from './users/index.js';
import setEventsRoutes from './events/index.js';
import setWatcherRoutes from './watcher/index.js';


export const setRoutes = (app) => {
  setSensorsRoutes(app);
  setUsersRoutes(app);
  setEventsRoutes(app);
  setWatcherRoutes(app);
}
