const MQTT = require('async-mqtt');
require('dotenv/config.js');

const client = MQTT.connect(process.env.MQTT_URL);

const data = [
  {
    id: 1,
    active: Math.random() >= 0.6,
    lat: '19.769025',
    lng: '98.949914'
  },
  {
    id: 2,
    active: Math.random() >= 0.6,
    lat: '19.781939',
    lng: '98.945755'
  },
  {
    id: 3,
    active: Math.random() >= 0.6,
    lat: '19.784711',
    lng: '98.947046'
  },
  {
    id: 4,
    active: Math.random() >= 0.6,
    lat: '19.756218',
    lng: '98.953974'
  },
];

const onConnectHandler = async () => {
  console.log('Starting test');

  const topic = process.argv[2];

	try {
    if (topic === 'polling') await client.publish(topic, JSON.stringify(data));
    if (topic === 'alarm') await client.publish(topic, JSON.stringify(data));
    await client.end();
    
		console.log('Done test');
	} catch (e){
		console.log(e.stack);
		process.exit();
	}
}

client.on('connect', onConnectHandler);
