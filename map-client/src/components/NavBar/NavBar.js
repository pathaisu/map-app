import React from 'react';
import styled from 'styled-components';


function handleClick() {
  window.location.href = '/';
}

const Container = styled.nav`
  border: 1px solid #E9EAEC;
  box-shadow: 0 1px 6px 0 rgba(0,0,0,.06);
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 25px;
  margin-left: 10px;
  cursor: pointer;
`;

const RightNavBar = styled.div`
  padding: 5px;
  marginRight: 10px;
`;

const Profile = styled.div`
  display: inline-block;
  height: 38px;
  width: 38px;
  background-color: #C8C8C8;
  border-radius: 50%;
`;

const NavBar = () => {
  return (
    <Container className="navbar">
      <NavBrand onClick={handleClick}>
        NETWORK LAB
      </NavBrand>
      <RightNavBar className="navbar-end">
        <Profile />
      </RightNavBar>
    </Container>
  );
};

export default NavBar;
