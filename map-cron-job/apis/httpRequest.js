import fetch from 'node-fetch';

export const getEvents = async (timestamp) => {
  const data = await fetch(`http://api:3002/map/v1/events/producer?timestamp=${timestamp}`, { 
    mode: 'cors',
    method: 'POST',
  }).then(res => res.json());
  
  return data;
}
