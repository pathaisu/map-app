/**
 * id: 000 - 005 (000 will be gw)
 * lat: 19.769025
 * lng: 98.889989
 * sem: 0 - 10
 * uis: 0 - 10
 * bat: 0 - 15000
 * soc: 0 - 100
 */
export const mockSensors = { 
  data: [
    {
      id: '000',
      lat: '19.769025',
      lng: '98.949914',
      sem: 8,
      uis: 8,
      bat: 4000,
      soc: 50,
    },
    {
      id: '001',
      lat: '19.769025',
      lng: '98.949914',
      sem: 8,
      uis: 8,
      bat: 4000,
      soc: 50,
    },
    {
      id: '002',
      lat: '19.781939',
      lng: '98.945755',
      sem: 8,
      uis: 8,
      bat: 4000,
      soc: 50,
    },
    {
      id: '003',
      lat: '19.784711',
      lng: '98.947046',
      sem: 8,
      uis: 8,
      bat: 4000,
      soc: 50,
    },
    {
      id: '004',
      lat: '19.756218',
      lng: '98.953974',
      sem: 8,
      uis: 8,
      bat: 4000,
      soc: 50,
    },
  ]
};

export const mockEvent = {
  eventType: 'alarm',
  reason: 'What happen ...',
  timestamp: 1339032023,
  sensors: mockSensors,
}

export const mockUser = {
  username: 'test',
  password: 'test1234',
}
