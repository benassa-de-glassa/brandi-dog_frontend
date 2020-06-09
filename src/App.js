import React, { Component } from 'react';

// import logo from './logo.svg';
import './App.css';
import './mycss.css'

import TopBar from './components/topbar/Topbar'
import Menu from './components/menu/Menu'
import Game from './components/game/Game'

import { postData, API_URL_WITHOUT_V1 } from './paths'
import { socket } from './socket'


class App extends Component {
    constructor() {
        super();
        this.state = {
            socketConnected: false, // connection to socket.io of the backend
            playerLoggedIn: false,  // player has signed in with a name
            showMenu: true,         // top menu containing global chat and lobbies
            player: {
                username: "",
                uid: null
            },
            gameID: null,           // currently joined game
            gameToken: ''           // jwt
        }

        this.toggleMenu = this.toggleMenu.bind(this)
        this.getPlayer = this.getPlayer.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.playerQuit = this.playerQuit.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.joinGameSocket = this.joinGameSocket.bind(this)
        this.leaveGame = this.leaveGame.bind(this)
    }

    startSocketIO() {
        // connect to the backend socket.io instance
        // the socket connection state is indicated by the green or red circle
        // const socket = getSocket()
        socket.on('connect', () => {
            console.log('socket.io connection successful')
            this.setState({ socketConnected: true })
        })
        socket.on('disconnect', () => {
            console.log('socket.io connection lost.');
            this.setState({ socketConnected: false })
        })
        socket.on('error', data => {
            console.error(data)
        })
    }

    componentDidMount() {
        this.getPlayer()    // try to log in using a httponly cookie
        this.startSocketIO()
    }

    toggleMenu() {
        this.setState({ showMenu: !this.state.showMenu })
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
            socket.open()
            this.setState({
                playerLoggedIn: true,
                player: {
                    username: player.username,
                    uid: player.uid
                }
            })
            // player is already in a game
            if (player.current_game) {
                this.joinGameSocket(player.game_token)
            }
        } else {
            console.error(player)
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
        console.warn(response.status, responseJson)
        try {
            errorCallback(responseJson.detail)
        } catch (error) {
            console.log(error)
        }
    }
}

async logout() {
    socket.close()
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

async joinGame(gameID) {
    const response = await postData(
        'games/' + gameID + '/join',
        this.state.player
    )
    const responseJson = await response.json()
    if (response.status === 200) {
        this.joinGameSocket(responseJson.game_token)
    } else {
        console.warn(responseJson)
    }
}

async joinGameSocket(game_token) {
    console.log(game_token)
    socket.emit('join_game_socket', {
        player: this.state.player,
        game_token: game_token
    })
    socket.on('join_game_success', data => {
        console.log(data)
        this.setState({
            gameID: data.game_id
        })
    })
}

async leaveGame() {
    socket.emit('leave_game',
        {
            game_id: this.state.gameID,
            player_id: this.state.player.uid
        }
    )
    socket.on('leave_game_success', () => {
        this.setState({ gameID: null })
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
                    joinGame={this.joinGame}
                    joinedGame={this.state.gameID}
                    joinGameSocket={this.joinGameSocket}
                    leaveGame={this.leaveGame}
                />
            }
            {
                this.state.playerLoggedIn && this.state.gameID !== null &&
                <Game player={this.state.player} gameID={this.state.gameID} />
            }
        </div>
    )
};
}

export default App;
