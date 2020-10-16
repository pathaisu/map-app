# Map Application
1. Collection of sensors will be shown on service
2. When sensor has been setup, app will get active sensor from server
3. Inactive status will make decision by frontend => server will record sensor status then check that last record is longer than 2 mins or not
4. Sensor.

```js
// Topic /gw/alarm & /gw/polling
{ 
  "id": 0, 
  "lat": 13.818835, 
  "lng": 100.513596, 
  "bat": 0, 
  "soc": 0,
}
```

- status => more frequent
- lat, lng => to save battery, it will be a bit longer to receive status
5. Sensing feature from sensor, => web socket => PubSub with MQTT


# Test scenario
1. Open website then it will subscribe ws and start polling
2. insert data via postman
3. web should show event stack that all sensors still fine
4. insert invalid sensor via postman
5. Web should show event that contains error
6. Insert recovery record agian
7. Fire MQTT event to notify that error occurs
