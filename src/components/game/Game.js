import React, { Component } from 'react'

import Chat from '../chat/Chat'
import Board from '../board/Board'
import Controls from '../controls/Controls'

import { socket } from '../../socket'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [
                { uid: 0, value: 1, color: "hearts" },
                { uid: 1, value: "Q", color: "hearts" },
                { uid: 2, value: 3, color: "hearts" },
                { uid: 3, value: 4, color: "hearts" },
                { uid: 4, value: 5, color: "hearts" },
                { uid: 5, value: "K", color: "hearts" }
            ],
            selectedCardIndex: null,
            players: ['', '', '', ''],
            marbles: []
        }

        this.cardClicked = this.cardClicked.bind(this)
        this.handleNewGameState = this.handleNewGameState.bind(this)
    }


    componentDidUpdate(prevProps){
        if (prevProps.gameID !== this.props.gameID){ // change in game id means player hs joined a new game
            socket.emit('join-game', {
                game_id: this.props.gameID, 
                player: this.props.player
            })
        }
    }

    handleNewGameState(data){
        const players = data.order.map(uid => data.players[uid])
        var marbles = []
        data.order.forEach(uid => {
            marbles.push(...data.players[uid].marbles)
        });
        this.setState(prevState => 
            ({
                ...prevState,
                players: data.order.map(uid => data.players[uid]),
                marbles: marbles
            })
        )
    }

    componentDidMount() {
        socket.on('game-state', data => {
            console.log('received game state', data)
            this.handleNewGameState(data)
        })
        socket.on('player-state', data => {
            console.log('received player state', data)
          })
        
        socket.on('join-game-success', data => {
            console.log('succesfully joined game socket', data)
          })
          
      }

    cardClicked(index) {
        console.log(this.state.cards[index].value + " clicked")
        this.setState({selectedCardIndex: index})

        // TODO: Request valid moves from server and display them on the board
    }

    stepClicked(index) {
        console.log("step" + index + "clicked")

        // TODO: Request possible cards that can be played and mark them
    }

    render() {
        return (
            <div className="game-container">
                <Board playerList={this.state.players} marbleList={this.state.marbles}/>
                <div className="right-container">
                    <Controls 
                            cards={this.state.cards} 
                            cardClicked={this.cardClicked}
                            selectedCardIndex={this.state.selectedCardIndex}
                    />
                    <Chat player={this.props.player}/>
                </div>

            </div>
        )
    }
}

export default Game;