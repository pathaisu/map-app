import React, { Component } from 'react';
import styled from 'styled-components';

import MapContent from '../components/MapContent';
import Notification from '../components/Notification';
import { getWatcher, getEvents } from '../apis/httpRequest';


const Container = styled.div`
  display: flex;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFF;
  width: 250px;
  height: calc(100vh - 52px);
  padding: 10px;
  border: 1px solid #E9EAEC;
  box-shadow: 1px 0 6px 0 rgba(0,0,0,.06);
`;

const MapContainer = styled.div`
  display: block;
  width: 200px;
`;

const ActivityContainer = styled.div`
  display: block;
  height: 300px;
  // border: 1px solid #000;
`;

const FalseAlarmContainer = styled.div`
  display: block;
  height: 100%;
  // border: 1px solid #000;
`;

const setPinActiveStatus = (data) => {
  return data.map(sensor => {
    sensor.active = true;
    return sensor;
  });
}

const setPinInActiveStatus = (sensors, notifications) => {
  const sensorIds = notifications.map(notification => {
    return notification.sensor.id;
  });

  return sensors.map(sensor => {
    if (sensorIds.includes(sensor.id)) sensor.active = false;
    return sensor;
  });
  
  // return data.map(sensor => {
  //   return Object.assign(sensor, {
  //     active: true,
  //   });
  // });
}

class MapPage extends Component {
  state = {}
  socket = new WebSocket("ws://localhost:3003");
  notifications = []
  
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  // async getPositions() {
  //   const { data } = await getData();

  //   const inactiveSensors = data.filter(item => {
  //     return item.active === false
  //   }).map(item => {
  //     return item.id
  //   })

  //   const activeStatus = (inactiveSensors.length === 0);
  //   const msgStatus = activeStatus ? 'All Sensors' : `Sensor id [${inactiveSensors.join()}]`

  //   this.notifications.unshift({ 
  //     msg: msgStatus, 
  //     status: activeStatus 
  //   });

  //   await this.setStateAsync({ sensors: data })
  // }

  async pollingEvents() {
    // const data = await getEvents('1602330528431');
    // const result = this.state.notifications.concat(data);

    // const sensorResult = setPinInActiveStatus(this.state.sensors, result);

    // await this.setStateAsync({ sensors: sensorResult });
    // await this.setStateAsync({ notifications: result });
  }

  async componentDidMount() {
    // this.socket.onopen = () => {
    //   setInterval(() => {
    //     const wsPayload = {
    //       id: Math.floor(Math.random() * 4) + 1  ,
    //       lat: '19.756218',
    //       lng: '98.953974',
    //       active: Math.random() >= 0.6,
    //     };

    //     this.socket.send(JSON.stringify(wsPayload));
    //   }, 14000)
    // }

    this.socket.onmessage = async (event) => {
      // const wsPayload = JSON.parse(JSON.parse(event.data));
    
      // if (wsPayload.active === false) {
      //   this.notifications.unshift({ 
      //     msg: `Alert !!! sensor no ${wsPayload.id}`, status: false
      //   });
      // }

      // const data = this.state.sensors.map(item => {
      //   if (item.id === wsPayload.id) item.active = wsPayload.active;
      //   return item
      // });

      const data = [JSON.parse(event.data)];

      const sensorResult = setPinInActiveStatus(this.state.sensors, data);
      const result = this.state.notifications.concat(data);

      console.log(result)

      await this.setStateAsync({ notifications: result });
      await this.setStateAsync({ sensors: sensorResult });

      // data.forEach((sensor) => {
      //   if (!sensor.active) {
      //     this.notifications.unshift({ 
      //       msg: `Alert !!! sensor no ${sensor.id}`, status: false
      //     });
      //   }
      // });

      // await this.setStateAsync({ sensors: data });
    }

    const data = await getWatcher();
    
    this.setStateAsync({ sensors: setPinActiveStatus(data) });
    this.setStateAsync({ notifications: [] });
  
    setInterval(() => {
      this.pollingEvents();
    }, 9000);
  }

  render() {
    return (
      <Container>
        <Panel>
          <ActivityContainer>
            <Notification notifications={this.state.notifications} />
          </ActivityContainer>
        </Panel>
        <MapContainer>
          <MapContent sensors={this.state.sensors} />
        </MapContainer>
      </Container>
    )
  }
}

export default MapPage;
