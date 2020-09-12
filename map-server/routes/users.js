import { mockUser } from './__fixtures__/sensors.js';

export default (app) => {
  app.get('/user/v1/profile', (req, res) => {
    res.json(mockUser);
  });
} 
