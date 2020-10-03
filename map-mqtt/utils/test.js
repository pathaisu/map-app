const MQTT = require('async-mqtt');
require('dotenv/config.js');

const client = MQTT.connect(process.env.MQTT_URL);

/**
 * id: 000 is gw
 * id: 0xx is node
 */
const data = [
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
];

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const onConnectHandler = async () => {
  console.log('Starting test');

  const topic = process.argv[2];

	try {
    if (topic === 'polling') await client.publish(topic, JSON.stringify(data[getRandomNumber(5)]));
    if (topic === 'alarm') await client.publish(topic, JSON.stringify(data[getRandomNumber(5)]));
    if (topic === '/gw/all') await client.publish(topic, JSON.stringify(data[getRandomNumber(5)]));
    if (topic === '/gw/alarm') await client.publish(topic, JSON.stringify(data[getRandomNumber(5)]))

    await client.end();
    
		console.log('Done test');
	} catch (e){
		console.log(e.stack);
		process.exit();
	}
}

client.on('connect', onConnectHandler);
