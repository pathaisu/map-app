import React from 'react';
import styled from 'styled-components';

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
  fontWeight: 'bold',
}

const sensorInActiveStatus = {
  color: '#FF0000',
  fontWeight: 'bold',
}

const ButtonSensor = styled.div`
  margin-left: 30px;
`;

function Notification(props) {
  let pollingNotifications = [];
  let alarmNotifications = [];

  if (props.notifications) {
    console.log(props.notifications);

    pollingNotifications = props.notifications.filter(notification => notification.eventType === 'polling');

    alarmNotifications = props.notifications.filter(notification => notification.eventType === 'alarm');
  }

  // if (props.notifications) {
  //   pollingNotifications = props.notifications.filter(notification => notification.eventType === 'polling');

  //   alarmNotifications = props.notifications.filter(notification => notification.eventType === 'alarm');
  // }

  
  return (
    <div>
      {/* <Container>
        <span>{ props.data.msg }</span>
        <span style={props.data.status ? sensorActiveStatus : sensorInActiveStatus }>
          { props.data.status ? 'Active' :  'Inactive' }
        </span>
      </Container>
      <ButtonSensor>
        <p className="buttons">
          <button className="button">
            <span className="icon is-small">
              E
            </span>
          </button>
        </p>
      </ButtonSensor> */}

      <MainContainer>
        <h1><b>Alarm</b></h1>
        {
          alarmNotifications.map((value, index) => {
            return (
              <ItemContainer key={index}>
                <ContentContainer>{ `${value.sensor.id} : ${value.reason}` }</ContentContainer>
              </ItemContainer>
            )
          })
        }
      </MainContainer>
      <br/>
      <MainContainer>
        <h1><b>Polling</b></h1>
        {
          pollingNotifications.map((value, index) => {
            return (
              <ItemContainer key={index}>
                <ContentContainer>{ `${value.sensor.id} : ${value.reason}` }</ContentContainer>
              </ItemContainer>
            )
          })
        }
      </MainContainer>
    </div>
  );
}

export default Notification;
