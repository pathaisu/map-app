import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
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

const Container = styled.div`
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
  return (
    <MainContainer>
      <Container>
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
      </ButtonSensor>
    </MainContainer>
  );
}

export default Notification;
