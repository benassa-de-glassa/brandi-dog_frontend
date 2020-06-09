import React, { Component } from 'react'

import GameViewer from './GameViewer'
import GlobalChat from './GlobalChat'
import './menu.css'


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className='menu-container'>
                <GameViewer 
                    playerLoggedIn={this.props.playerLoggedIn} 
                    player={this.props.player}
                    joinGame={this.props.joinGame}
                    joinedGame={this.props.joinedGame}
                    joinGameSocket={this.props.joinGameSocket}
                    leaveGame={this.props.leaveGame}
                />
                <GlobalChat 
                    playerLoggedIn={this.props.playerLoggedIn} 
                    player={this.props.player}
                />
            </div>
        )
    }
}

export default Menu;