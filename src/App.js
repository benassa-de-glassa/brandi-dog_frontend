import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import './mycss.css'

import TopBar from './components/topbar/Topbar'
import Menu from './components/menu/Menu'
import Game from './components/game/Game'

import { socket } from './socket'
import { postData } from './paths'

import { DEBUG } from './config'

class App extends Component {
  constructor() {
    super();
    this.state = {
      socketConnected: false,
      playerLoggedIn: false,
      showMenu: true,
      player: {
        name: "", 
        uid: undefined
      },
      gameID: undefined
    }

    this.toggleMenu = this.toggleMenu.bind(this)
    this.registerPlayer = this.registerPlayer.bind(this)
    this.playerQuit = this.playerQuit.bind(this)
    this.setGameID = this.setGameID.bind(this)
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

    if (DEBUG) {
      this.registerPlayer('testName', () => {})
    }
  }

  toggleMenu() {
    this.setState({showMenu: !this.state.showMenu})
  }

  setGameID(gameID) {
    this.setState({gameID: gameID})
  }

  async registerPlayer(player, errorCallback) {
    // sends player name to API_URL/player
    // returns {name: str, id: str}
    const response = await postData('player', {name: player})
    const responseJson = await response.json()
    if (response.status === 200) {
      this.setState({
        playerLoggedIn: true,
        player: responseJson
      })
    } else {
      console.log(response.status, responseJson)
    }
  }

  playerQuit() {
    this.setState({
      playerLoggedIn: false,
      player: {name: "", uid: undefined}
    })
  }
  
  render() {
    return (
      <div className="App">
        <header>
          <TopBar 
              socketConnected={this.state.socketConnected}
              playerLoggedIn={this.state.playerLoggedIn}
              player={this.state.player}
              registerPlayer={this.registerPlayer}
              showMenu={this.state.showMenu} 
              toggleMenu={this.toggleMenu}
              playerQuit={this.playerQuit}
          />
        </header>
        { 
          this.state.showMenu &&
          <Menu 
              playerLoggedIn={this.state.playerLoggedIn}
              player={this.state.player}
              setGameID={this.setGameID}
          /> 
        }
        {
          this.state.playerLoggedIn && this.state.gameID !== undefined && 
          <Game player={this.state.player} gameID={this.state.gameID}/>
        }
      </div>
    )
  };
}

export default App;
 