import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { setResolveEvent } from '../../apis/httpRequest';

import SensorInfo from './SensorInfo';
import NotificationInfo from './NotificationInfo';


const ActivityContainer = styled.div`
  display: block;
  height: 300px;
`;


const pollingItemStyle = {
  color: '#FF5E13',
  fontSize: '12px',
}

const alarmItemStyle = {
  color: '#FF0000',
  fontSize: '12px',
}

const Notification = (props) => {
  const { pollingEvents, alarmEvents, sensorStatus } = props;

  const [alarmNotifications, setAlarmNotifications] = useState([]);
  const [pollingNotifications, setPollingNotifications] = useState([]);

  const reducer = (acc, cur) => {
    if (acc[cur.sensor.id]) {
      acc[cur.sensor.id].push(cur);
    } else {
      acc[cur.sensor.id] = [cur];
    }
  
    return acc;
  };

  const notificationsGenerator = (events) => {
    return [
    ...Object.values(events
      .filter(notification => notification.status === 'not_resolve')
      .reduce(reducer, {}))
    ];
  }

  useEffect(() => {
    if (alarmEvents) setAlarmNotifications(notificationsGenerator(alarmEvents));
  }, [alarmEvents]);

  useEffect(() => {
    if (pollingEvents) setPollingNotifications(notificationsGenerator(pollingEvents));
  }, [pollingEvents]);

  return (
    <ActivityContainer>
      <SensorInfo sensorStatus={sensorStatus} />
      <NotificationInfo 
        title={'สถานะ (โดนบุกรุก)'}
        notifications={alarmNotifications} 
        itemStyle={alarmItemStyle}
      />
      <NotificationInfo         
        title={'สถานะ (ขาดการติดต่อ)'}
        notifications={pollingNotifications} 
        itemStyle={pollingItemStyle}
      />
    </ActivityContainer>
  );
}

export default Notification;
