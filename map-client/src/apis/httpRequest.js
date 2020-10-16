export const getWatcher = async () => {
  const data = await fetch('http://localhost:3002/map/v1/watcher', { 
    mode: 'cors' 
  }).then(res => res.json());
  
  return data;
}

export const getEvents = async (timestamp) => {
  const data = await fetch(`http://localhost:3002/map/v1/events?timestamp=${timestamp}`, { 
    mode: 'cors' 
  }).then(res => res.json());
  
  return data;
}

export const insertData = async (sensor) => {
  const data = await fetch('http://localhost:3002/map/v1/sensors', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sensor),
  }).then(res => res.json());

  return data;
}
