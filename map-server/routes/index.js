import setSensorsRoutes from './sensors.js';
import setAreasRoutes from './areas.js';
import setUsersRoutes from './users.js';
import setEventsRoutes from './events.js';


export const setRoutes = (app) => {
  setSensorsRoutes(app);
  setAreasRoutes(app);
  setUsersRoutes(app);
  setEventsRoutes(app);
}
