# How to work with Dokcer

### Docker compose start up.
```bash
docker-compose up -d

docker-compose up => ctrl + C
```

### Docker container access.
```bash
# Access web container.
docker exec -it map-docker_website_1 sh

# Access mongo container.
docker exec -it map-docker_mongo_1 sh
```

### Docker 
```bash
docker stop :container_id
docker rm :container_id
```

# How to use mongodb

```bash
show dbs
use :db_name
```

# API
- GET `/sensor/v1/sensors`
- POST `/sensor/v1/sensors`
- PUT `/sensor/v1/sensors/:id`
- DELETE `/sensor/v1/sensors/:id`

### Payload

```js
{
  status: [{
    id: string,
    active: boolean,
    lat: float,
    lng: float,
  }],
}
```

# Socket
- `/sensor/v1/sensors`

### Payload

```js
{
  status: {
    id: string,
    active: boolean,
    lat: float,
    lng: float,
  },
}
```
