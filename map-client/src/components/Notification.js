import React from 'react';
import styled from 'styled-components';
import { setResolveEvent } from '../apis/httpRequest';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow: auto;
  border
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 5px;
  width: 100%;
  margin-top: 10px;
  background-color: #F5F5F5;
  border: 1px solid #E9EAEC;
  box-shadow: 0 1px 6px 0 rgba(0,0,0,.4);
  cursor: pointer;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: 'start;
  align-items: start;
`;

const sensorActiveStatus = {
  color: '#228B22',
  fontSize: '12px',
}

const sensorAlarmInActiveStatus = {
  color: '#FF0000',
  fontSize: '12px',
}

const sensorPollingInActiveStatus = {
  color: '#FF5E13',
  fontSize: '12px',
}

function Notification(props) {
  let pollingNotifications = [];
  let alarmNotifications = [];

  const reducer = (acc, cur) => {
    if (acc[cur.sensor.id]) {
      acc[cur.sensor.id].push(cur);
    } else {
      acc[cur.sensor.id] = [cur];
    }

    return acc;
  };

  if (props.notifications) {
    // pollingNotifications = props.notifications
    //   .filter(notification => notification.eventType === 'polling');

    pollingNotifications = Object.values(props.notifications
      .filter(notification => notification.eventType === 'polling')
      .reduce(reducer, {}));

    alarmNotifications = props.notifications
      .filter(notification => notification.eventType === 'alarm');
  }

  const handleClick = async (event, id) => {
    delete event._id;
    console.log(event);

    await setResolveEvent(event);
    console.log(document.getElementById(id))
    document.getElementById(id).style.color = '#228B22';
  };

  return (
    <div>
      <MainContainer>
        <h1><b>Alarm</b></h1>
        {
          alarmNotifications.map((value, index) => {
            return (
              <ItemContainer
                id={ `alarm${index}`}
                key={index}
                style={
                  value.status === 'not_resolve' ?  sensorAlarmInActiveStatus : sensorActiveStatus
                }
              >
                <ContentContainer>
                  { `No: ${index + 1}` }<br/>
                  { `ID: ${value.sensor.id}` }<br/>
                  { `reason: ${value.reason}`}<br/>
                  { `time: ${value.timestamp}` }<br/>
                  { `status: ${value.status}` }<br/>
                  <button onClick={() => { handleClick(value, `alarm${index}`) }}>Resolve</button>
                </ContentContainer>
              </ItemContainer>
            )
          })
        }
      </MainContainer>
      <br/>
      {/* <MainContainer>
        <h1><b>Polling</b></h1>
        {
          pollingNotifications.map((value, index) => {
            return (
              <ItemContainer
                id={ `polling${index}`}
                key={index}
                style={
                  value.status === 'not_resolve' ? sensorPollingInActiveStatus : sensorActiveStatus
                }
              >
                <ContentContainer>
                  { `No: ${index + 1}` }<br/>
                  { `ID: ${value.sensor.id}` }<br/>
                  { `reason: ${value.reason}`}<br/>
                  { `time: ${value.timestamp}` }<br/>
                  { `status: ${value.status}` }<br/>
                  <button onClick={() => { handleClick(value, `polling${index}`) }}>Resolve</button>
                </ContentContainer>
              </ItemContainer>
            )
          })
        }
      </MainContainer> */}

      <MainContainer>
        <h1><b>Polling</b></h1>
        {
          pollingNotifications.map((value, index) => {
            return (
              <ItemContainer
                id={ `polling${index}`}
                key={index}
                style={ sensorPollingInActiveStatus }
              >
                <ContentContainer>
                  { `No: ${index + 1}` }<br/>
                  Too long since last sensor<br/>
                  { 
                    value.map((sensor, index) => {
                      return (
                        <div key={index}>
                          {index + 1}: {sensor.timestamp}<br/>
                        </div>
                      )
                    })
                  }
                </ContentContainer>
              </ItemContainer>
            )
          })
        }
      </MainContainer>
    </div>
  );
}

export default Notification;
