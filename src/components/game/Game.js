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
            players: ['', '', '', ''],
            activePlayerIndex: null,
            playerIsActive: false,
            marbles: [],    // player marbles
            cards: [],      // player cards
            selectedCardIndex: null,
            selectedAction: null,
            selectedMarble: null,
            tooltipActions: [],
            marbleToSwitch: null,
            gameState: null,    // see backend for numbers
            roundState: null,   // see backend for numbers
            topCard: null,
            cardSwapConfirmed: false,
            jokerAction: 0,     // only relevant if a joker is being played
            errorMessage: '',
        }
        this.handleNewGameState = this.handleNewGameState.bind(this)
        this.handleNewPlayerState = this.handleNewPlayerState.bind(this)
        this.startGame = this.startGame.bind(this)
        this.cardClicked = this.cardClicked.bind(this)
        this.marbleClicked = this.marbleClicked.bind(this)
        this.tooltipClicked = this.tooltipClicked.bind(this)
        this.swapCard = this.swapCard.bind(this)
        this.fold = this.fold.bind(this)
        this.setJokerAction = this.setJokerAction.bind(this)
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
        if (data.round_state === 5) {
            this.setState({ cardSwapConfirmed: false })
        }
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
                topCard: data.top_card,
                playerIsActive: players[data.active_player_index].uid === this.props.player.uid
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
            this.setState({ cardSwapConfirmed: true })
        }
    }

    async fold() {
        const relURL = 'games/' + this.props.gameID + '/fold'
        const response = await postData(relURL, this.props.player)
        const responseJson = await response.json()
        if (response.status !== 200) {
            console.log(responseJson)
        }
    }

    setJokerAction(val) {
        this.setState({ jokerAction: val })
    }

    marbleClicked(marble, homeClicked = false) {
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
                possibleActions = selectedCard.actions.filter(action => action !== 0)
            }
            if (selectedCard.value === 'Ja') {
                // handle jack (switch)
                if (this.state.marbleToSwitch === null) {
                    // no other marble has been selected
                    this.setState({ marbleToSwitch: marble })

                // check that one of my own and one not of my own is selected
                } else if ( // the marble that clicked last is my own
                    marble.color === this.state.marbles[0].color && this.state.marbleToSwitch !== this.state.marbleToSwitch
                ) { // marbleToSwitch is my own marble and the one clicked last is not
                    this.performSwitch(this.state.marbleToSwitch, marble)
                } else if (
                    marble.color !== this.state.marbles[0].color && this.state.marbleToSwitch === this.state.marbleToSwitch
                ) {
                    // marbleToSwitch is not my own marble and the one clicked last is my own
                    this.performSwitch(marble, this.state.marbleToSwitch)
                } else {
                    this.setState({ 
                        marbleToSwitch: null,
                        errorMessage: 'Choose one of your marbles, and one from another player.' 
                    })
                }
            } else if (possibleActions.length === 1) {
                // clicked on a marble on the field while a card with only one 
                // possible action
                this.performAction(marble, selectedCard, possibleActions[0])
                // this.setState({ selectedAction: selectedCard.actions[0] })
            } else if (selectedCard.value === 'Jo') {
                // handle Joker
                this.performAction(marble, selectedCard, this.state.jokerAction)
                this.setState({ selectedAction: null })
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
            })
        } else {
            console.log(responseJson)
        }
    }

    async performSwitch(ownMarble, otherMarble, card) {
        const relURL = 'games/' + this.props.gameID + '/action'
        const response = await postData(relURL, 
            {
                player: this.props.player,
                action: {
                    card: card,
                    action: 'switch',
                    mid: ownMarble.mid,
                    mid_2: otherMarble.mid
                }
            })
        const responseJson = await response.json()
        if (response.status === 200) {
            this.setState({ marbleToSwitch: null })
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
        } else {
            console.log(responseJson)
        }
    }

    render() {
        return (
            <div className="game-container">
                <Board
                    player={this.props.player}
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
                        playerIsActive={this.state.playerIsActive}
                        gameState={this.state.gameState}
                        roundState={this.state.roundState}
                        cards={this.state.cards}
                        cardClicked={this.cardClicked}
                        selectedCardIndex={this.state.selectedCardIndex}
                        selectedCard={this.state.cards[this.state.selectedCardIndex]}
                        startGame={this.startGame}
                        possibleMoves={this.state.possibleMoves}
                        setJokerAction={this.setJokerAction}
                        jokerAction={this.state.jokerAction}
                        swapCard={this.swapCard}
                        fold={this.fold}
                        cardSwapConfirmed={this.state.cardSwapConfirmed}
                    />
                    <Chat player={this.props.player} />
                </div>

            </div>
        )
    }
}

export default Game;