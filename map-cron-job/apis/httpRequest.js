import fetch from 'node-fetch';

export const getEvents = async (timestamp) => {
  const data = await fetch(`${process.env.API_URL}/map/v1/events/producer?timestamp=${timestamp}`, { 
    mode: 'cors',
    method: 'POST',
  }).then(res => res.json());
  
  return data;
}
