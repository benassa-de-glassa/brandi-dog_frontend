import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import './mycss.css'

import TopBar from './components/topbar/Topbar'
import Menu from './components/menu/Menu'
import Game from './components/game/Game'

import { socket } from './socket'
import { API_URL_WITHOUT_V1 } from './paths'

import { DEBUG } from './config'

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
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
    this.getPlayer = this.getPlayer.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
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
    this.getPlayer()

    if (DEBUG) {
      // register automatically as testName
      this.login('testName', () => { })
    }
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu })
  }

  setGameID(gameID) {
    this.setState({ gameID: gameID })
  }

  async getPlayer() {
    // try to get the player name and id from the backend. For this to work a 
    // valid authorization cookie has to be sent. 
    let url = new URL('users/me', API_URL_WITHOUT_V1)
    const playerResponse = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    const player = await playerResponse.json()
    if (playerResponse.status === 200) {
      this.setState({
        playerLoggedIn: true,
        player: {
          name: player.username,
          uid: player.id
        }
      })
    } else {
      console.log(player)
    }
  }

  async login(username, password, errorCallback) {
    // sends player name to API_URL/login
    // expects { name: str, id: str } in return

    const data = new URLSearchParams(
      {
        'grant_type': 'password',
        'username': username,
        'password': password
      }
    )

    let url = new URL('token', API_URL_WITHOUT_V1)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include', // ONLY FOR DEBUG PURPOSES
      body: data
    })
    const responseJson = await response.json()
    if (response.status === 200) {
      this.getPlayer()
    } else {
      console.debug(response.status, responseJson)
      try {
        errorCallback(responseJson.detail)
      } catch (error) {
        console.log(error)
      }
    }
  }

  async logout() {
    let url = new URL('logout', API_URL_WITHOUT_V1)
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    if (response.status === 200) {
      this.playerQuit()
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
            login={this.login}
            logout={this.logout}
            showMenu={this.state.showMenu}
            toggleMenu={this.toggleMenu}
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
