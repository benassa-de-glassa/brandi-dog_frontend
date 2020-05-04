import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import './mycss.css'

import TopBar from './components/Topbar'
import Game from './components/game/Game'

class App extends Component {
  constructor() {
    super();
    this.state = {
      socketConnected: false,
      player: {
        name: "", 
        uid: undefined
      }
    }
  }
  
  render() {
    return (
      <div className="App">
        <header>
          <TopBar 
              socketConnected={this.state.socketConnected}
              player={this.state.player}
          />
        </header>
        <Game player={this.state.player}/>
      </div>
    )
  };
}

export default App;
 