import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  padding: 50px;
  width: 400px;
  height: 400px;
  background-color: #F2F4F4;
  border-radius: 25px;
`;

const HomePage = () => {
  return (
    <Container>
      <Wrapper>
        <h1 className="title">Login</h1>

          <div className="field">
            <div className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="Username" />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
            <br/>

            <div className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="Password" />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
            <br/>

            <button className="button is-fullwidth">Login</button>
            <br/>

            <center><a href="/signup">Sign up</a></center>
        </div>
      </Wrapper>
    </Container>
  );
}

export default HomePage;
