import React, { Component } from 'react'

import Chat from '../chat/Chat'
import Board from '../board/Board'
import Controls from '../controls/Controls'


class Game extends Component {
    constructor() {
        super();
        this.state = {
            cards: [
                { uid: 0, value: 1, color: "hearts" },
                { uid: 1, value: "Q", color: "hearts" },
                { uid: 2, value: 3, color: "hearts" },
                { uid: 3, value: 4, color: "hearts" },
                { uid: 4, value: 5, color: "hearts" },
                { uid: 5, value: "K", color: "hearts" }
            ],
        }

        this.cardClicked = this.cardClicked.bind(this)
    }

    cardClicked(card) {
        console.log(card.value + " clicked")
    }

    render() {
        return (
            <div className="game-container">
                <Board />
                <div className="right-container">
                    <Controls cards={this.state.cards} cardClicked={this.cardClicked}/>
                    <Chat />
                </div>

            </div>
        )
    }
}

export default Game;