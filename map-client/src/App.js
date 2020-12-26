import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// import NavBar from './components/NavBar';
// import HomePage from './pages/HomePage';
import SingUpPage from './pages/SingUpPage';
import MapPage from './pages/MapPage';

import './App.scss';


class App extends Component {
  render() {
    return (
      <div>
        {/* <NavBar /> */}
        {/* <Route exact path="/" component={HomePage} /> */}
        <Route exact path="/" component={MapPage} />
        <Route path="/signup" component={SingUpPage} />
        {/* <Route path="/map" component={MapPage} /> */}
      </div>
    )
  }
}

export default App;
