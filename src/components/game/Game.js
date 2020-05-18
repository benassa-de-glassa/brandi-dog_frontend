import React, { Component } from 'react'

import Chat from '../chat/Chat'
import Board from '../board/Board'
import Controls from '../controls/Controls'

import { socket } from '../../socket'
import { postData } from '../../paths'

// if switch is selected need to send two marble ids and a player id

// array of cards that require a tooltip popup. For example, after playing
// '4', the player can choose to move forward or backward
// TODO: JOker
const cardsRequiringTooltip = ['A', '4', '7', 'Ja', 'Jo']

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false, 
            cards: [],
            selectedCardIndex: null,
            selectedAction: null,
            players: ['', '', '', ''],
            marbles: [],
            possibleMoves: {},
            marblesToSelect: 0,
            selectedCardRequiresTooltip: false,
        }
        this.cardClicked = this.cardClicked.bind(this)
        this.handleNewGameState = this.handleNewGameState.bind(this)
        this.handleNewPlayerState = this.handleNewPlayerState.bind(this)
        this.startGame = this.startGame.bind(this)
        this.marbleClicked = this.marbleClicked.bind(this)
        this.getActionFromControls = this.getActionFromControls.bind(this)
    }


    componentDidUpdate(prevProps){
        if (prevProps.gameID !== this.props.gameID){ 
            // change in game id means player has joined a new game
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
        if (index === this.state.selectedCardIndex){
            this.setState({
                selectedCardIndex: null,
                marblesToSelect: 0,
                selectedCardRequiresTooltip: false
            })
        } else {
            const selectedCard = this.state.cards[index]
            this.setState({
                selectedCardIndex: index,
                marblesToSelect: selectedCard.value === 'switch' ? 2 : 1,
                // check if the card requires a tooltip
                selectedCardRequiresTooltip: cardsRequiringTooltip.includes(selectedCard.value),
            })
            console.log('select' + this.state.marblesToSelect + 'marbles')
        }

        // TODO: Request valid moves from server and display them on the board
    }



    getActionFromControls(val) {
        this.setState({selectedAction: val})
    }
    async marbleClicked(marble) {
        if (this.state.selectedCardIndex !== null) {
            console.log('homeClicked')
            const selectedCard = this.state.cards[this.state.selectedCardIndex]
            
            if (selectedCard.actions.length === 1){
                this.setState({selectedAction: selectedCard.actions[0]})
            } 
            if (this.state.selectedAction !== null ) {

                var relURL = 'games/' + this.props.gameID + '/action'
                var responseJson = await postData(relURL, 
                    {
                        player: this.props.player,
                        action: {
                            action: this.state.selectedAction,
                            card: selectedCard, 
                            mid: marble.mid
                        }
                    })
                    console.log(responseJson)
                this.setState({
                    selectedCardIndex: null,
                    selectedAction: null
                })
            }
        } else {
            // TODO
        }
    }

    async startGame() {
        var relURL = 'games/' + this.props.gameID + '/start'
        var responseJson = await postData(relURL, 
                this.props.player,
            )
        if ('game_id' in responseJson) {
            this.setState({gameStarted: true})
        } else {
            console.log(responseJson.detail)
        }
    }

    render() {
        return (
            <div className="game-container">
                <Board 
                    playerList={this.state.players} 
                    marbleList={this.state.marbles}
                    selectedCardRequiresTooltip={this.state.selectedCardRequiresTooltip}
                    marbleClicked={this.marbleClicked}
                    // homeClicked={this.homeClicked}
                />
                <div className="right-container">
                    <Controls 
                        gameStarted={this.state.gameStarted}
                        cards={this.state.cards} 
                        cardClicked={this.cardClicked}
                        selectedCardIndex={this.state.selectedCardIndex}
                        selectedCard={this.state.cards[this.state.selectedCardIndex]}
                        startGame={this.startGame}
                        possibleMoves={this.state.possibleMoves}
                        getAction={this.getActionFromControls}
                    />
                    <Chat player={this.props.player}/>
                </div>

            </div>
        )
    }
}

export default Game;