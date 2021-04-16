import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import MapContent from '../components/MapContent';
import Notification from '../components/Notification';
import { getWatcher, getEvents, setResolveEvent } from '../apis/httpRequest';
import { wsEndpoint } from '../utils/config.js';

const POLLING_TIME = 30000; //process.env.REACT_APP_POLLING_TIME;
const POLLING_TYPE = 'polling';
const ALARM_TYPE = 'alarm';

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

// ws endpoint must be localhost because it's client side.
const socket = new WebSocket(wsEndpoint);
let intervalSensors;

const MapPage = () => {
  const [queryTimestamp, setQueryTimestamp] = useState(Date.now() - POLLING_TIME);
  const [sensors, setSensors] = useState([]);
  const [pollingEvents, setPollingEvents] = useState([]);
  const [alarmEvents, setAlarmEvents] = useState([]);
  const [sensorStatus, setSensorStatus] = useState({});

  /**
   * step 1: resolved sensor status
   */
  const resolvedEvents = async (events) => {
    const resolvedEvents = events
      .map(event => {
        if (event._id) delete event._id;
        event.status = 'resolve';

        return event;
      });

    await setResolveEvent(resolvedEvents);
  }

  const resolvedHandler = (sensorId, eventType) => {
    const activeFilter = event => event.sensor.id === sensorId;
    const inActiveFilter = event => event.sensor.id !== sensorId;

    if (eventType === ALARM_TYPE) {
      setAlarmEvents(alarmEvents.filter(inActiveFilter));
      resolvedEvents(alarmEvents.filter(activeFilter));
    }

    if (eventType === POLLING_TYPE) {
      setPollingEvents(pollingEvents.filter(inActiveFilter));
      resolvedEvents(pollingEvents.filter(activeFilter));
    }

    const resolvedSensors = sensors.map(sensor => {
      if (sensorId === sensor.id) sensor.active = true;
      return sensor;
    });

    setSensors(resolvedSensors);
  }

  /**
   * step 2: setup sensors information
   */
  const updateActiveStatus = async (events, status) => {
    const updatedSensors = await getWatcher();

    const updateSensorList = events.map(event => {
      return event.sensor.id;
    });

    return updatedSensors.map(sensor => {
      sensor.active = intervalSensors
        .filter(item => item.id === sensor.id)
        .map(item => item.active)[0];

      if (updateSensorList.includes(sensor.id)) sensor.active = status;

      return sensor;
    });
  }

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

  /** 
   * step 3: alarm config (websocket)
   */
  const alarmHandler = async (event) => {
    const newEvent = JSON.parse(event.data);

    setAlarmEvents(alarmEvents.concat(newEvent));
    updateSensorInfo([newEvent]);
    
    const updatedSensors = await updateActiveStatus([newEvent], false);
    
    intervalSensors = updatedSensors;
    setSensors(updatedSensors);
  }

  socket.onmessage = alarmHandler;

  /** 
   * step 4: polling config (setInterval)
   */
  const updateSensors = async () => {
    const updatedSensors = await getWatcher();
    setSensors(updatedSensors);
  };

  // something wrong here
  const updatePollingEvents = async () => {
    const { timestamp, events } = await getEvents(queryTimestamp);
    const newEvents = events.filter(event => event.eventType === POLLING_TYPE);

    setQueryTimestamp(timestamp);

    if (!newEvents.length) return;

    setPollingEvents(pollingEvents.concat(newEvents));
    updateSensorInfo(newEvents);
    
    const updatedSensors = await updateActiveStatus(newEvents, false);
    
    intervalSensors = updatedSensors;
    setSensors(updatedSensors);
  }

  const pollingHandler = () => {
    const timer = setInterval(() => {
      updatePollingEvents();
    }, POLLING_TIME);

    // when component destroy
    return () => clearInterval(timer);
  }

  const initHandler = () => {
    if (!sensors.length) updateSensors();
    intervalSensors = sensors;
  }

  useEffect(pollingHandler, [queryTimestamp]);
  useEffect(initHandler, [sensors]);

  return (
    <Container>
      <PanelContainer>
        <Notification 
          sensorStatus={sensorStatus}
          pollingEvents={pollingEvents}
          alarmEvents={alarmEvents}
          onResolvedClick={resolvedHandler}
        />
      </PanelContainer>
      <MapContainer>
        <MapContent sensors={sensors} />
      </MapContainer>
    </Container>
  )
}

export default MapPage;
