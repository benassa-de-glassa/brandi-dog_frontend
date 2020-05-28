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
                    setGameID={this.props.setGameID}
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