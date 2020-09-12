import React, { Component } from 'react';
import styled from 'styled-components';


const Container = styled.nav`
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
  height: 500px;
  background-color: #F2F4F4;
  border-radius: 25px;
`;

class SingUpPage extends Component {
  render() {
    return (
     <Container>
        <Wrapper>
          <h1 className="title">Sign up</h1>

            <div className="field">
              <div className="control has-icons-left has-icons-right">
                <input className="input" type="text" placeholder="First name" />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
              <br/>

              <div className="control has-icons-left has-icons-right">
                <input className="input" type="text" placeholder="Last name" />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
              <br/>

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

              <button className="button is-fullwidth">Sign up</button>
              <br/>
          </div>
        </Wrapper>
      </Container>
    )
  }
}

export default SingUpPage;
