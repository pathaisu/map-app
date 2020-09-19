import setSensorsRoutes from './sensors.js';
import setUsersRoutes from './users.js';
import setEventsRoutes from './events.js';


export const setRoutes = (app) => {
  setSensorsRoutes(app);
  setUsersRoutes(app);
  setEventsRoutes(app);
}
