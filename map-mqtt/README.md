# MQTT Service

This is an entry service which has been called by Gateway using `MQTT protocol`.

To run `simulator/app` you have to create `.env` from `.env.sample` because `ENVIRONMENT variables` from `docker-compose` won't valid for the simulator.

```sh
# command to simulate new polling event then insert into DB
npm run test-gw-all
```

```sh
# command to simulate new alarm event then insert into DB
npm run test-gw-alarm
```