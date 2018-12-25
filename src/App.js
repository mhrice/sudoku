import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Puzzle from "./puzzle";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 style={{marginTop: "0px", marginBottom: "0.25em"}}>Sudoku Solver</h1>
        <Puzzle/>
      </div>
    );
  }
}

export default App;
