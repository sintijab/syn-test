import React from 'react';
import logo from './img/logo.png';
import background from './img/index.png';
import './App.css';
import SignIn from './SignIn/SignIn';
import { connect } from 'react-redux';

function App() {
  return (
    <div className="App">
      <img src={background} className="App-bg" alt="bg" />
      <SignIn />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default connect()(App);
