import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import './mycss.css'

import TopBar from './components/Topbar'
import Menu from './components/menu/Menu'
import Game from './components/game/Game'

import { socket } from './socket'
// const socket = io('localhost:8000')

class App extends Component {
  constructor() {
    super();
    this.state = {
      socketConnected: false,
      showMenu: false,
      player: {
        name: "", 
        uid: undefined
      }
    }

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  startSocketIO() {
    // connect to the backend socket.io instance
    // the socket connection state is indicated by the green or red circle
    socket.on('connect', () => {
      console.log('socket.io connection successful')
      this.setState({ socketConnected: true })
    })
    socket.on('disconnect', () => {
      console.log('socket.io connection lost.');
      this.setState({ socketConnected: false })
    });
  }

  componentDidMount() {
    this.startSocketIO()
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
 