const MQTT = require('async-mqtt');
require('dotenv/config.js');

const client = MQTT.connect(process.env.MQTT_URL)

/**
 * id: 000 is gw
 * id: 0xx is node
 */
const data = [
  {
    id: 0,
    lat: 13.819293155554421, 
    lng: 100.51422362785925,
    // lat: 19.769025,
    // lng: 98.949914,
    sem: 8,
    uis: 8,
    bat: 4000,
    soc: 50,
  },
  {
    id: 1,
    lat: 13.821814392872355,
    lng: 100.51350481174389,
    sem: 8,
    uis: 8,
    bat: 4000,
    soc: 50,
  },
  {
    id: 2,
    lat: 13.81919939951439,
    lng: 100.5116165163441,
    sem: 8,
    uis: 8,
    bat: 4000,
    soc: 50,
  },
  {
    id: 3,
    lat: 13.82073086991163,
    lng: 100.51559695376817,
    sem: 8,
    uis: 8,
    bat: 4000,
    soc: 50,
  },
  {
    id: 4,
    // lat: 13.817933872650897,
    // lng: 100.51665929458002,
    lat: 19.769025,
    lng: 98.949914,
    sem: 1,
    uis: 4,
    bat: 4000,
    soc: 50,
  },
];

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const onConnectHandler = async () => {
  const topic = process.argv[2];

	try {
    const message = JSON.stringify(data[1]);

    await client.publish(topic, message);    
    await client.end();
    
		console.log('Done test');
	} catch (e){
		console.log(e.stack);
		process.exit();
	}
}

client.on('connect', onConnectHandler);
