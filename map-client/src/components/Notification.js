import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import toDate from 'date-fns/toDate';
import Battery from '../components/Battery';
import Signal from '../components/Signal';
import { setResolveEvent } from '../apis/httpRequest';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled(MainContainer)`
  height: 30vh;
`;

const ErrorContainer = styled(MainContainer)`
  height: 35vh;
`;

const Title = styled.h1`
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
  padding-top: 5px;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  &:hover {
    background-color: rgba(0,0,0,.1) !important;
    border-radius: 5px;
  }

  display: flex;
  flex-direction: column;
  justify-content: 'start;
  align-items: start;
  width: 100%;
  padding: 5px 5px;
`;

const ItemTitleWrapper = styled.div`
  font-weight: bold;
  margin-bottom: 3px;
`;

const InfoWrapper = styled.div`
  margin-bottom: 3px;
`;

const SensorStatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ResolveButton = styled.button`
  color: #FFF !important;
  width: 100%;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  background: #555555;
  border-radius: 5px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;
  padding: 5px;
  margin-top: 5px;
`;

const Divider = styled.div`
  width: 100%;
  margin: 10px 0;
  border-bottom: 1px solid #CED5DB;
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

const reducer = (acc, cur) => {
  if (acc[cur.sensor.id]) {
    acc[cur.sensor.id].push(cur);
  } else {
    acc[cur.sensor.id] = [cur];
  }

  return acc;
};

function Notification(props) {
  // const [alarmNotifications, setAlarmNotifications] = useState(
  //   props.notifications && props.notifications.length > 0
  //     ? Object.values(props.notifications
  //         .filter(notification => notification.eventType === 'alarm')
  //         .reduce(reducer, {}))
  //     : []
  // );

  const [alarmNotifications, setAlarmNotifications] = useState([]);

  // const [pollingNotifications, setPollingNotifications] = useState(
  //   props.notifications && props.notifications.length > 0
  //     ? Object.values(props.notifications
  //         .filter(notification => notification.eventType === 'polling')
  //         .reduce(reducer, {}))
  //     : []
  // );

  const [pollingNotifications, setPollingNotifications] = useState([]);

  const { notifications } = props;

  useEffect(() => {
    if (notifications) {
      console.log(Object.values(notifications));
      setAlarmNotifications(
        () => ([
          ...Object.values(notifications
            .filter(notification => notification.eventType === 'alarm')
            .filter(notification => { 
              console.log(notification);
              return notification.status === 'not_resolve'
            })
            .reduce(reducer, {}))
          ])
      )
    }
  }, [notifications]);

  useEffect(() => {
    if (notifications) {
      setPollingNotifications(
        () => ([
          ...Object.values(notifications
            .filter(notification => notification.eventType === 'polling')
            .filter(notification => notification.status === 'not_resolve')
            .reduce(reducer, {}))
          ])
      )
    }
  }, [notifications]);

  const handleClick = async (id) => {
    const alarmEvent = alarmNotifications[id];
    const pollingEvent = pollingNotifications[id];

    if(alarmNotifications[id]) {
      // console.log(id);
      // console.log(alarmNotifications.splice(id, 1));
      // console.log(alarmNotifications);

      alarmNotifications.splice(id, 1);
      await setResolveEvent(alarmEvent);
      setAlarmNotifications([...alarmNotifications]);
    }

    if(pollingNotifications[id]) {
      if (pollingEvent._id) delete pollingEvent._id;

      // await setResolveEvent(pollingEvent);
      // setPollingNotifications(pollingNotifications.splice(id));
    }
  };

  return (
    <div>
      <InfoContainer>
        <Title>สถานะทั่วไป</Title>
        <ItemsContainer>
          {
            pollingNotifications.map((value, index) => {
              const latestSensor = value[value.length - 1];
              const {
                soc = 0,
                sem = 0,
                uls = 0,
              } = latestSensor.sensor;

              return (
                <ItemContainer               
                  key={index}
                >
                  <ItemTitleWrapper style={{ color: '#000' }}>
                    { index === 0 ? 'Gateway' : `Sensor หมายเลข: ${index}` }
                  </ItemTitleWrapper>
                  <SensorStatusWrapper style={{ color: '#000' }}>
                    BAT: <Battery power={soc}></Battery>
                    SEM: <Signal level={sem}></Signal>
                    ULS: <Signal level={uls}></Signal>        
                  </SensorStatusWrapper>
                  {
                    (pollingNotifications.length - 1) > index && <Divider></Divider>
                  }
                </ItemContainer>
              );
            })
          } 
        </ItemsContainer>
      </InfoContainer>
      <ErrorContainer>
        <Title>สถานะ (โดนบุกรุก)</Title>
        <ItemsContainer>
          {
            alarmNotifications.map((value, index) => {
              const timestamps = value.map(sensor => sensor.timestamp);

              return (
                <ItemContainer
                  id={ `alarm${index}`}
                  key={index}
                  style={ sensorAlarmInActiveStatus }
                >
                  <ItemTitleWrapper style={{ color: '#000' }}>
                    { value[0].sensor.id === 0 ? 'Gateway' : `Sensor หมายเลข: ${value[0].sensor.id}` } โดนบุกรุก
                  </ItemTitleWrapper>
                  <ItemTitleWrapper>
                    จำนวนครั้งที่พบปัญหา: { value.length } ครั้ง
                  </ItemTitleWrapper>
                  {
                    value.map((val, index) => {
                      return (
                        <div key={index}>
                          ({ index + 1 }): เวลา { toDate(Number(val.timestamp)).toLocaleString() }
                        </div>
                      )
                    })
                  }
                  {/* <InfoWrapper>
                    เวลา: { toDate(Number(value.timestamp)).toLocaleString() }
                  </InfoWrapper> */}
                  {/* <InfoWrapper>
                    สถานะ: { value.status === 'not_resolve' ? 'ยังไม่ได้รับการตรวจสอบ' : 'ได้รับการตรวจสอบแล้ว' }
                  </InfoWrapper> */}
                  <ResolveButton
                    // onClick={() => { handleClick(value, `alarm${index}`) }}
                    onClick={() => {
                      props.action(timestamps);
                      handleClick(index);
                    }}
                  >
                    ทำการตรวจสอบ
                  </ResolveButton>
                  {
                    (alarmNotifications.length - 1) > index && <Divider></Divider>
                  }
                </ItemContainer>
              )
            })
          }
        </ItemsContainer>
      </ErrorContainer>
      <ErrorContainer>
        <Title>สถานะ (ขาดการติดต่อ)</Title>
        <ItemsContainer>
          {
            pollingNotifications.map((value, index) => {
              // const latestSensor = value[value.length - 1];
              // const latestSensorTime = toDate(Number(latestSensor.timestamp)).toLocaleString();

              return (
                <ItemContainer
                  id={ `polling${index}`}
                  key={index}
                  style={ sensorPollingInActiveStatus }
                >
                  <ItemTitleWrapper style={{ color: '#000' }}>
                    { index === 0 ? 'Gateway' : `Sensor หมายเลข: ${index}` }
                  </ItemTitleWrapper>
                  <ItemTitleWrapper>
                    จำนวนครั้งที่พบปัญหา: { value.length } ครั้ง
                  </ItemTitleWrapper>
                  {
                    value.map((val, index) => {
                      return (
                        <div key={index}>
                          ({ index + 1 }): เวลา { toDate(Number(val.timestamp)).toLocaleString() }
                        </div>
                      )
                    })
                  }
                  <InfoWrapper>
                    {/* - เวลา: { latestSensorTime } */}
                  </InfoWrapper>
                  <ResolveButton 
                    // onClick={() => { handleClick(value, `polling${index}`) }}
                    onClick={() => { handleClick(index) }}
                  >
                    ทำการตรวจสอบ
                  </ResolveButton>
                  {
                    (pollingNotifications.length - 1) > index && <Divider></Divider>
                  }
                </ItemContainer>
              )
            })
          }
        </ItemsContainer>
      </ErrorContainer>
    </div>
  );
}

export default Notification;
