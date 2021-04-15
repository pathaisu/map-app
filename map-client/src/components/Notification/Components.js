import styled from 'styled-components';


const Title = styled.h1`
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
  padding-top: 5px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const Divider = styled.div`
  width: 100%;
  margin: 10px 0;
  border-bottom: 1px solid #CED5DB;
`;

const ErrorContainer = styled(MainContainer)`
  height: 35vh;
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

export {
  Title,
  MainContainer,
  ItemsContainer,
  ItemContainer,
  ItemTitleWrapper,
  Divider,
  ErrorContainer,
  ResolveButton,
}
