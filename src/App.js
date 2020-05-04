import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import './mycss.css'

import TopBar from './components/Topbar'
import Menu from './components/menu/Menu'
import Game from './components/game/Game'

class App extends Component {
  constructor() {
    super();
    this.state = {
      socketConnected: false,
      showMenu: true,
      player: {
        name: "", 
        uid: undefined
      }
    }

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({showMenu: !this.state.showMenu})
  }
  
  render() {
    return (
      <div className="App">
        <header>
          <TopBar 
              socketConnected={this.state.socketConnected}
              player={this.state.player}
              showMenu={this.state.showMenu} 
              toggleMenu={this.toggleMenu}
          />
        </header>
        { 
          this.state.showMenu &&
          <Menu/> 
        }
        <Game player={this.state.player}/>
      </div>
    )
  };
}

export default App;
 