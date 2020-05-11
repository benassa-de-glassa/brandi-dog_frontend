import React, { Component } from 'react'

import Chat from '../chat/Chat'
import Board from '../board/Board'
import Controls from '../controls/Controls'

import { socket } from '../../socket'
import { postData } from '../../paths'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            selectedCardIndex: null,
            players: ['', '', '', ''],
            marbles: []
        }

        this.cardClicked = this.cardClicked.bind(this)
        this.handleNewGameState = this.handleNewGameState.bind(this)
        this.handleNewPlayerState = this.handleNewPlayerState.bind(this)
        this.startGame = this.startGame.bind(this)
    }


    componentDidUpdate(prevProps){
        if (prevProps.gameID !== this.props.gameID){ // change in game id means player hs joined a new game
            socket.emit('join-game', {
                game_id: this.props.gameID, 
                player: this.props.player,
            })
        }
    }

    handleNewGameState(data){
        const players = data.order.map(uid => data.players[uid])
        var marbles = []
        data.order.forEach(uid => {
            marbles.push(...data.players[uid].marbles)
        })
        this.setState(prevState => 
            ({
                ...prevState,
                players: players,
                marbles: marbles,
                game_state: data.game_state,
                round_state: data.round_state,
            })
        )
    }

    handleNewPlayerState(data){
        console.log(data)
        this.setState({cards: data.hand})
    }
    componentDidMount() {
        socket.on('game-state', data => {
            console.log('received game state', data)
            this.handleNewGameState(data)
        })
        socket.on('player-state', data => {
            console.log('received player state', data)
            this.handleNewPlayerState(data)
          })
        
        socket.on('join-game-success', data => {
            console.log('succesfully joined game socket', data)
          })
          
      }

    cardClicked(index) {
        console.log(this.state.cards[index].value + " clicked")
        console.log(index, this.state.selectedCardIndex)
        if (index === this.state.selectedCardIndex){
            this.setState({selectedCardIndex: null})
        } else {
            this.setState({selectedCardIndex: index})
        }

        // TODO: Request valid moves from server and display them on the board
    }

    stepClicked(index) {
        console.log("step" + index + "clicked")

        // TODO: Request possible cards that can be played and mark them
    }

    async startGame() {
        var responseJson = await postData('games/' + this.props.gameID + '/start', 
                this.props.player
            )
        if ('game_id' in responseJson) {
        } else {
            console.log(responseJson.detail)
        }
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
                        selectedCard={this.state.cards[this.state.selectedCardIndex]}
                        startGame={this.startGame}
                    />
                    <Chat player={this.props.player}/>
                </div>

            </div>
        )
    }
}

export default Game;