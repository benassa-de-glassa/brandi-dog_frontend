import React, { Component } from 'react'

import Chat from '../chat/Chat'
import Board from '../board/Board'
import Controls from '../controls/Controls'

import { socket } from '../../socket'
import { postData } from '../../paths'

// if switch is selected need to send two marble ids and a player id

// array of cards that require a tooltip popup. For example, after playing
// '4', the player can choose to move forward or backward
// TODO: Joker
// const cardsRequiringTooltip = ['A', '4', '7', 'Ja', 'Jo']

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false,
            players: ['', '', '', ''],
            activePlayerIndex: null,
            marbles: [],    // player marbles
            cards: [],      // player cards
            selectedCardIndex: null,
            selectedAction: null,
            selectedMarble: null,
            tooltipActions: [],
            marblesToSelect: 0, // 2 for the Jack (switch), 1 otherwise
            gameState: null,    // see backend for numbers
            roundState: null,   // see backend for numbers
            topCard: null,
        }
        this.handleNewGameState = this.handleNewGameState.bind(this)
        this.handleNewPlayerState = this.handleNewPlayerState.bind(this)
        this.startGame = this.startGame.bind(this)
        this.setAction = this.setAction.bind(this)
        this.cardClicked = this.cardClicked.bind(this)
        this.marbleClicked = this.marbleClicked.bind(this)
        this.tooltipClicked = this.tooltipClicked.bind(this)
        this.swapCard = this.swapCard.bind(this)
    }


    componentDidUpdate(prevProps) {
        if (prevProps.gameID !== this.props.gameID) {
            // change in game id means player has joined a new game
            socket.emit('join-game', {
                game_id: this.props.gameID,
                player: this.props.player,
            })
        }
    }

    handleNewGameState(data) {
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
                gameState: data.game_state,
                roundState: data.round_state,
                activePlayerIndex: data.active_player_index,
                topCard: data.top_card
            })
        )
    }

    handleNewPlayerState(data) {
        this.setState({ cards: data.hand })
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
        // deselect selected step
        this.setState({ selectedMarble: null })
        if (index === this.state.selectedCardIndex) {
            // if the selected card is clicked again
            this.setState({
                selectedCardIndex: null,
                marblesToSelect: 0,
                selectedCardRequiresTooltip: false,
            })
        } else {
            const selectedCard = this.state.cards[index]
            this.setState({
                selectedCardIndex: index,
                marblesToSelect: selectedCard.value === 'switch' ? 2 : 1,
            })
            console.log('select' + this.state.marblesToSelect + 'marbles')
        }

        // TODO: Request valid moves from server and display them on the board
    }

    async swapCard() {
        const selectedCard = this.state.cards[this.state.selectedCardIndex]
        console.debug('try to swap', selectedCard)
        const relURL = 'games/' + this.props.gameID + '/swap_cards '
        const response = await postData(relURL,
            {
                player: this.props.player,
                card: selectedCard
            })
        const responseJson = await response.json()
        console.log(responseJson)
        if (response.status === 200) {
        }
    }

    setAction(val) {
        this.setState({ selectedAction: val })
    }

    marbleClicked(marble, homeClicked=false) {
        this.setState({ selectedMarble: marble })
        if (this.state.selectedCardIndex !== null) {
            let selectedCard = this.state.cards[this.state.selectedCardIndex]
            if (selectedCard.actions.includes(0) && homeClicked) {
                // (try) to go out
                this.performAction(marble, selectedCard, 0)
                return
            } 
            // home is not clicked
            let possibleActions = selectedCard.actions
            if (selectedCard.actions.includes(0)) {
                // remove the 0 from the options to see if a tooltip is needed
                possibleActions = selectedCard.actions.filter( action => action !== 0)
            }
            if (possibleActions.length === 1) {
                // clicked on a marble on the field while a card with only one 
                // possible action
                this.performAction(marble, selectedCard, possibleActions[0])
                // this.setState({ selectedAction: selectedCard.actions[0] })
            } else {
                // clicked on a marble on the field for which multiple actions
                // are possible
                this.setState({ 
                    tooltipActions: possibleActions,
                    selectedMarble: marble
                })
            }
        } else {
        // TODO
        }
    }

    tooltipClicked(action) {
        let selectedCard = this.state.cards[this.state.selectedCardIndex]
        this.performAction(this.state.selectedMarble, selectedCard, action)
    }

    async performAction(marble, card, action) {
        // performs an action selected marble
        const relURL = 'games/' + this.props.gameID + '/action'
        const response = await postData(relURL,
            {
                player: this.props.player,
                action: {
                    card: card,
                    action: action,
                    mid: marble.mid
                }
            })
        const responseJson = await response.json()
        if (response.status === 200) {
            this.setState({
                selectedCardIndex: null,
                selectedAction: null,
                tooltipActions: [],
                marblesToSelect: 0,
            })
        } else {
            console.log(responseJson)
        }
        
    }

    async startGame() {
        const relURL = 'games/' + this.props.gameID + '/start'
        const response = await postData(relURL,
            this.props.player,
        )
        const responseJson = await response.json()
        if (response.status === 200) {
            this.setState({ gameStarted: true })
        } else {
            console.log(responseJson)
        }
    }

    render() {
        return (
            <div className="game-container">
                <Board
                    playerList={this.state.players}
                    activePlayerIndex={this.state.activePlayerIndex}
                    marbleList={this.state.marbles}
                    selectedMarble={this.state.selectedMarble}
                    tooltipActions={this.state.tooltipActions}
                    tooltipClicked={this.tooltipClicked}
                    marbleClicked={this.marbleClicked}
                    selectedCard={this.state.cards[this.state.selectedCardIndex]}
                    topCard={this.state.topCard}
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
                        setAction={this.setAction}
                        roundState={this.state.roundState}
                        swapCard={this.swapCard}
                    />
                    <Chat player={this.props.player} />
                </div>

            </div>
        )
    }
}

export default Game;