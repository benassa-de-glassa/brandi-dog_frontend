import React, { Component } from 'react'

import GameViewer from "./GameViewer"
import './menu.css'


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [0, 1, 2, 3]
        }
    }

    render() {
        return (
            <div className="menu-container">
                <GameViewer games={this.state.games} />
            </div>
        )
    }
}

export default Menu;