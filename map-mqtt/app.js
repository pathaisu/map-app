const MQTT = require('async-mqtt');
const fetch = require('node-fetch');
require('dotenv/config.js');

const http = new require('http');
const ws = new require('ws');
const wss = new ws.Server({
  noServer: true,
});

const ALARM_TOPIC = 'alarm';
const POLLING_TOPIC = 'polling';

const mqttClient = MQTT.connect(process.env.MQTT_URL);

const onSocketConnect = (wsClient) => {
  console.log('WS connecting');

  wsClient.on('message', function(message) {
    console.log(JSON.stringify(message));

    wsClient.send(JSON.stringify(message)) 
  });

  wsClient.on('close', function() {
    console.log('close connection');
  });

  mqttClient.on('message', async function (topic, message) {
    console.log(`-------- # ${topic} #---------`);
    
    if (topic === ALARM_TOPIC) {
      console.log(JSON.parse(message));

      wsClient.send(JSON.stringify(JSON.parse(message)));
    }
  
    if (topic === POLLING_TOPIC) {
      console.log(JSON.parse(message));
      
      // await fetch('http://localhost:3002/map/v1/sensors', {
      await fetch('http://localhost:3002/map/v1/events/polling', {
        method: 'post',
        body: message,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  });
}

const onConnectHandler = async () => {
	console.log('MQTT connecting');
	try {
    await mqttClient.subscribe(POLLING_TOPIC, function (err) {
      if (!err) {
        console.log('Subscribe polling success');
      }
    });

    await mqttClient.subscribe(ALARM_TOPIC, function (err) {
      if (!err) {
        console.log('Subscribe alarm success');
      }
    });
    
    console.log('Done');
    
	} catch (e){
		console.log(e.stack);
		process.exit();
	}
}

mqttClient.on('connect', onConnectHandler);

const server = http.createServer((req, _) => {
  // here we only handle websocket connections
  // in real project we'd have some other code here to handle non-websocket requests
  wss.handleUpgrade(
    req, 
    req.socket, 
    Buffer.alloc(0), 
    onSocketConnect
  );
});

server.listen(3003, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

process.on('SIGINT', () => {
  mqttClient.end();
  process.exit();
});
