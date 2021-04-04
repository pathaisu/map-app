import fetch from 'node-fetch';
import 'dotenv/config.js';

export const addPollingEvent = async (message) => {
  const requestOptions = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: message,
  };

  const response = await fetch(`${process.env.API_URL}/map/v1/events/polling`, requestOptions);
  const data = await response.json();

  return data;
}

export const addAlarmEvent = async (message) => {
  const requestOptions = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: message,
  };

  const response = await fetch(`${process.env.API_URL}/map/v1/events/alarm`, requestOptions);
  const data = await response.json();

  return data;
}
