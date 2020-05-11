import React, { Component } from 'react'

import GameViewer from "./GameViewer"
import './menu.css'


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [
                {
                    id: 0,
                    name: 'Coole Runde',
                    players: ['Lara', 'Bene', 'Thilo']
                },
                {
                    id: 1,
                    name: 'Uncoole Runde',
                    players: ['Fritz', 'Fratz', 'Frutz']
                }
            ]
        }
    }

    render() {
        return (
            <div className="menu-container">
                <GameViewer 
                    playerLoggedIn={this.props.playerLoggedIn} 
                    player={this.props.player}
                />
            </div>
        )
    }
}

export default Menu;