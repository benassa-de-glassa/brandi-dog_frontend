import React, { Component } from 'react';
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
      socketConnected: false,   // connection to socket.io of the backend
      playerLoggedIn: false,    // player has signed in with a name
      showMenu: true,           // top menu containing global chat and lobbies
      player: {
        name: "",
        uid: null
      },
      gameID: null              // currently joined game
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
      // register automatically as testName
      this.registerPlayer('testName', () => { })
    }
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu })
  }

  setGameID(gameID) {
    this.setState({ gameID: gameID })
  }

  async registerPlayer(player, errorCallback) {
    // sends player name to API_URL/player
    // expects { name: str, id: str } in return
    const response = await postData('player', { name: player })
    const responseJson = await response.json()
    if (response.status === 200) {
      this.setState({
        playerLoggedIn: true,
        player: responseJson
      })
    } else {
      console.debug(response.status, responseJson)
      try {
        errorCallback(responseJson.detail)
      } catch (error) {
        console.log(error)
      }
    }
  }

  playerQuit() {
    this.setState({
      playerLoggedIn: false,
      player: { name: "", uid: null },
      gameID: null
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
          <Game player={this.state.player} gameID={this.state.gameID} />
        }
      </div>
    )
  };
}

export default App;
