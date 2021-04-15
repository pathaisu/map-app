import React from 'react';
import toDate from 'date-fns/toDate';


import {   
  Title,
  ItemsContainer,
  ItemContainer,
  ItemTitleWrapper,
  Divider,
  ErrorContainer,
  ResolveButton,
} from './Components';

const NotificationItem = (notifications, itemStyle) => {
  return notifications.map((value, index) => {
    const sensorId = value[0].sensor.id;
    const timestamps = value.map(sensor => sensor.timestamp);

    const title = sensorId === 0 ? 'Gateway' : `Sensor หมายเลข: ${sensorId}`;
    const divider = (notifications.length - 1) > index && <Divider></Divider>;
    const subItemList = value.map((val, index) => {
      return (
        <div key={index}>
          ({ index + 1 }): เวลา { toDate(Number(val.timestamp)).toLocaleString() }
        </div>
      )
    });

    return (
      <ItemContainer
        key={index}
        style={ itemStyle }
      >
        <ItemTitleWrapper style={{ color: '#000' }}>{ title }</ItemTitleWrapper>
        <ItemTitleWrapper>จำนวนครั้งที่พบปัญหา: { value.length } ครั้ง</ItemTitleWrapper>
        { subItemList }
        <ResolveButton 
          onClick={() => timestamps}
        >
          ทำการตรวจสอบ
        </ResolveButton>
        { divider }
      </ItemContainer>
    )
  });
};

const NotificationInfo = (props) => {
  const { notifications, itemStyle, title } = props;

  const itemList = NotificationItem(notifications, itemStyle);

  return (
    <ErrorContainer>
      <Title>{ title }</Title>
      <ItemsContainer>{ itemList }</ItemsContainer>
    </ErrorContainer>
  );
} 

export default NotificationInfo;
