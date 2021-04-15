import React from 'react';
import styled from 'styled-components';

import Battery from '../Battery';
import Signal from '../Signal';
import {   
  Title,
  MainContainer,
  ItemsContainer,
  ItemContainer,
  ItemTitleWrapper,
  Divider,
} from './Components';

const InfoContainer = styled(MainContainer)`
  height: 30vh;
`;

const SensorStatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SensorInfo = (props) => {
  const { sensorStatus } = props;
  const sensorList = Object.values(sensorStatus);

  const itemList = sensorList.map((sensor, index) => {
    const {
      id,
      soc = 0,
      sem = 0,
      uls = 0,
    } = sensor;

    const title = index === 0 ? 'Gateway' : `Sensor หมายเลข: ${id}`;
    const divider = (sensorList.length - 1) > index && <Divider />;
  
    return (
      <ItemContainer key={index}>
        <ItemTitleWrapper style={{ color: '#000' }}>{ title }</ItemTitleWrapper>
        <SensorStatusWrapper style={{ color: '#000' }}>
          BAT: <Battery power={soc}></Battery>
          SEM: <Signal level={sem}></Signal>
          ULS: <Signal level={uls}></Signal>        
        </SensorStatusWrapper>
        { divider }
      </ItemContainer>
    );
  });  

  return (
    <InfoContainer>
      <Title>สถานะทั่วไป</Title>
      <ItemsContainer>{ itemList }</ItemsContainer>
    </InfoContainer>
  );
} 

export default SensorInfo;
