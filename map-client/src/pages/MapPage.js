import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import MapContent from '../components/MapContent';
import Notification from '../components/Notification';
import { getWatcher, getEvents } from '../apis/httpRequest';
import { wsEndpoint } from '../utils/config.js';

const POLLING_TIME = 6000; //30000; //process.env.REACT_APP_POLLING_TIME;

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

  @media (max-width: 920px) {
    display: none;
  }
`;

const MapContainer = styled.div`
  display: block;
  height: 100vh;
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

// ws endpoint must be localhost because it's client side.
const socket = new WebSocket(wsEndpoint);

const MapPage = () => {
  const [queryTimestamp, setQueryTimestamp] = useState(Date.now() - POLLING_TIME);
  const [sensors, setSensors] = useState([]);
  const [pollingEvents, setPollingEvents] = useState([]);
  const [alarmEvents, setAlarmEvents] = useState([]);
  const [sensorStatus, setSensorStatus] = useState({});

  /** 
   * step 1: polling config (setInterval)
   */
  const updateSensors = async () => {
    const sensors = await getWatcher();

    setSensors(sensors);
  };

  const updatePollingEvents = async () => {
    const { timestamp, events } = await getEvents(queryTimestamp);
    const newEvents = events.filter(event => event.eventType === 'polling');

    setQueryTimestamp(timestamp);

    if (!newEvents.length) return;
    setPollingEvents(pollingEvents.concat(newEvents));
    updateSensorInfo(newEvents);
  }

  const pollingHandler = () => {
    updateSensors();

    const timer = setInterval(() => {
      updatePollingEvents();
    }, POLLING_TIME);

    // when component destroy
    return () => clearInterval(timer);
  }

  useEffect(pollingHandler, [queryTimestamp]);

  /** 
   * step 2: alarm config (websocket)
   */
  const alarmHandler = (event) => {
    const newEvent = JSON.parse(event.data);

    setAlarmEvents(alarmEvents.concat(newEvent));
    updateSensorInfo([newEvent]);
  }

  socket.onmessage = alarmHandler;

  /**
   * step 3: setup sensors information
   */
  const updateSensorInfo = (events) => {
    const reducer = (acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    };

    const uniqueEvents = events
      .map(event => event.sensor)
      .reduce(reducer, {});

    setSensorStatus({
      ...sensorStatus,
      ...uniqueEvents,
    });
  }

  return (
    <Container>
      <PanelContainer>
        <Notification 
          // action={this.notificationHandler.bind(this)}
          sensorStatus={sensorStatus}
          pollingEvents={pollingEvents}
          alarmEvents={alarmEvents}
        />
      </PanelContainer>
      <MapContainer>
        <MapContent sensors={sensors} />
      </MapContainer>
    </Container>
  )
}

export default MapPage;
