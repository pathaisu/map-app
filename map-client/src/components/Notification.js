import React from 'react';
import styled from 'styled-components';
import toDate from 'date-fns/toDate';
import Battery from '../components/Battery';
import Signal from '../components/Signal';
import { setResolveEvent } from '../apis/httpRequest';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 30vh;
`;

const Title = styled.h1`
  font-weight: bold;
  text-align: center;
`;

const ItemsWrapper = styled.div`
  height: 100%;
  overflow: auto;
  padding: 5px 10px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 40vh;
`;

const InfoItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 5px;
  margin: 10px;
  background-color: #F5F5F5;
  border: 1px solid #E9EAEC;
  border-radius: 10px;
  box-shadow: 0 0 1px 0 rgba(0,0,0,.4);
  cursor: pointer;
  font-size: 12px;
  overflow: auto;
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
  border-radius: 10px;
  box-shadow: 0 0 1px 0 rgba(0,0,0,.4);
  cursor: pointer;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: 'start;
  align-items: start;
`;

const TitleWrapper = styled.div`
  font-weight: bold;
  margin-bottom: 3px;
`;

const InfoWrapper = styled.div`
  margin-bottom: 3px;
`;

const SensorStatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 6px;
  margin-bottom: 6px;
  // border-bottom: 1px solid #CED5DB;
`;

const ResolveButton = styled.button`
  color: #fff !important;
  width: 100%;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  background: #555555;
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;
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
    pollingNotifications = Object.values(props.notifications
      .filter(notification => notification.eventType === 'polling')
      .reduce(reducer, {}));

    alarmNotifications = props.notifications
      .filter(notification => notification.eventType === 'alarm');
  }

  const handleClick = async (event, id) => {
    delete event._id;

    await setResolveEvent(event);
    console.log(document.getElementById(id))
    document.getElementById(id).style.color = '#228B22';
  };

  return (
    <div>
      <InfoContainer>
        <Title>INFO</Title>
        <InfoItemContainer>
          {
            pollingNotifications.map((value, index) => {
              const latestSensor = value[value.length - 1];
              const {
                soc = 0,
                sem = 0,
                uls = 0,
              } = latestSensor.sensor;

              return (
                <ContentContainer>
                  <TitleWrapper style={{ color: '#000' }}>
                    { index === 0 ? 'Gateway' : `Sensor หมายเลข: ${index}` }
                  </TitleWrapper>
                  <SensorStatusWrapper style={{ color: '#000' }}>
                    BAT: <Battery power={soc}></Battery>
                    SEM: <Signal level={sem}></Signal>
                    ULS: <Signal level={uls}></Signal>        
                  </SensorStatusWrapper>
                </ContentContainer>
              );
            })
          } 
        </InfoItemContainer>
      </InfoContainer>
      <MainContainer>
        <Title>ALARM</Title>
        <ItemsWrapper>
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
                    <TitleWrapper>
                      Sensor หมายเลข: {value.sensor.id} โดนบุกรุก
                    </TitleWrapper>
                    <InfoWrapper>
                      เวลา: { toDate(Number(value.timestamp)).toLocaleString() }
                    </InfoWrapper>
                    <InfoWrapper>
                      สถานะ: { value.status === 'not_resolve' ? 'ยังไม่ได้รับการตรวจสอบ' : 'ได้รับการตรวจสอบแล้ว' }
                    </InfoWrapper>
                    <ResolveButton 
                      onClick={() => { handleClick(value, `alarm${index}`) }}
                    >
                      ทำการตรวจสอบ
                    </ResolveButton>
                  </ContentContainer>
                </ItemContainer>
              )
            })
          }
        </ItemsWrapper>
      </MainContainer>
      <MainContainer>
        <Title>POLLING</Title>
        <ItemsWrapper>
          {
            pollingNotifications.map((value, index) => {
              const latestSensor = value[value.length - 1];
              const latestSensorTime = toDate(Number(latestSensor.timestamp)).toLocaleString();

              return (
                <ItemContainer
                  id={ `polling${index}`}
                  key={index}
                  style={ sensorPollingInActiveStatus }
                >
                  <ContentContainer>
                    <TitleWrapper style={{ color: '#000' }}>
                      { index === 0 ? 'Gateway' : `Sensor หมายเลข: ${index}` }
                    </TitleWrapper>
                    <TitleWrapper>
                      จำนวนครั้งที่พบปัญหา: { value.length } ครั้ง
                    </TitleWrapper>
                    <InfoWrapper>
                      เวลา: { latestSensorTime }
                    </InfoWrapper>
                    <ResolveButton 
                      onClick={() => { handleClick(value, `polling${index}`) }}
                    >
                      ทำการตรวจสอบ
                    </ResolveButton>
                  </ContentContainer>
                </ItemContainer>
              )
            })
          }
        </ItemsWrapper>
      </MainContainer>
    </div>
  );
}

export default Notification;
