import { Validator } from 'jsonschema';
import { appLogger } from './logger.js';

export const sensorValidation = (message) => {
  const v = new Validator();

  const schema = {
    id: '/sensor',
    type: 'object',
    properties: {
      id: { type: 'number' },
      lat: { type: 'number' },
      lng: { type: 'number' },
      sem: { type: 'number' },
      uis: { type: 'number' },
      bat: { type: 'number' },
      soc: { type: 'number' },
    },
  };

  const result = v.validate(JSON.parse(message.toString()), schema);

  if (result.valid) return true;

  appLogger.error(result.error);

  return false;
}
