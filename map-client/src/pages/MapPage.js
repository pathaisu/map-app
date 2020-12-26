import React, { Component } from 'react';
import styled from 'styled-components';

import MapContent from '../components/MapContent';
import Notification from '../components/Notification';
import { getWatcher, getEvents } from '../apis/httpRequest';

const POLLING_TIME = 30000;

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFF;
  width: 250px;
  border: 1px solid #E9EAEC;
  box-shadow: 1px 0 6px 0 rgba(0,0,0,.06);
  // height: calc(100vh - 52px);

  @media (max-width: 920px) {
    display: none;
  }
`;

const MapContainer = styled.div`
  display: block;
  height: 100vh;
`;

const ActivityContainer = styled.div`
  display: block;
  height: 300px;
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
}

class MapPage extends Component {
  // ws endpoint must be localhost because it's client side.
  socket = new WebSocket("ws://localhost:3003");
  state = {};
  notifications = [];
  queryTime = '';
  
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async pollingEvents() {
    // when there is no available sensors on web
    if (this.state.sensors.length === 0) {
      const data = await getWatcher();
      
      this.setStateAsync({ sensors: setPinActiveStatus(data) });
    }

    if (!this.queryTime) {
      this.queryTime = Date.now() - POLLING_TIME;
    }

    const { 
      timestamp,
      events,
    } = await getEvents(this.queryTime);

    const timestampList = this.state.notifications.map(notification => notification.timestamp);
    const filteredEvent = events.filter(event => {
      return !timestampList.includes(event.timestamp);
    });

    const result = this.state.notifications.concat(filteredEvent)

    const sensorResult = setPinInActiveStatus(this.state.sensors, result);

    await this.setStateAsync({ sensors: sensorResult });
    await this.setStateAsync({ notifications: result });
    this.queryTime = timestamp;
  }

  async componentDidMount() {
    this.socket.onmessage = async (event) => {
      const data = [JSON.parse(event.data)];
      const sensorResult = setPinInActiveStatus(this.state.sensors, data);
      const result = this.state.notifications.concat(data);

      await this.setStateAsync({ notifications: result });
      await this.setStateAsync({ sensors: sensorResult });
    }

    const data = await getWatcher();
    
    this.setStateAsync({ sensors: setPinActiveStatus(data) });
    this.setStateAsync({ notifications: [] });
  
    setInterval(() => {
      this.pollingEvents();
    }, POLLING_TIME);
  }

  async notificationHandler(timestamps) {
    this.setStateAsync({ notifications: this.state.notifications.map(
      notification => {
        if (timestamps.includes(notification.timestamp)) notification.status = 'resolve';

        return notification;
      })
    });
  }

  render() {
    return (
      <Container>
        <PanelContainer>
          <ActivityContainer>
            <Notification 
              action={this.notificationHandler.bind(this)}
              notifications={this.state.notifications}
            />
          </ActivityContainer>
        </PanelContainer>
        <MapContainer>
          <MapContent sensors={this.state.sensors} />
        </MapContainer>
      </Container>
    )
  }
}

export default MapPage;
