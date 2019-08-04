import React from 'react';
import logo from './img/logo.png';
import background from './img/index2.png';
import './App.css';
import SignIn from './SignIn/SignIn';
import Menu from './Menu/Menu';
import Posts from './Posts/Posts';
import { connect } from 'react-redux';

function App() {
  return (
    <div className="App">
      <img src={background} className="App-bg" alt="bg" />
      <Posts />
      <Menu />
      <SignIn />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default connect()(App);
