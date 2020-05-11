import React, { Component } from 'react'

import GameViewer from "./GameViewer"
import './menu.css'


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="menu-container">
                <GameViewer 
                    playerLoggedIn={this.props.playerLoggedIn} 
                    player={this.props.player}
                    getGameID={this.props.getGameID}
                />
            </div>
        )
    }
}

export default Menu;