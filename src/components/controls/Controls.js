import React, { useState } from 'react'

import Hand from './Hand'
import './controls.css'

/*
action_options values can be the following:
        0: get started
        1: move up 1
        2: move up 2
        3: move up 3
        4: move up 4
        -4: move 4 back
        5: move up 5
        6: move up 6
        7: move up 7 times 1
        8: move up 8
        9: move up 9
        10: move up 10
        11: move up 11
        12: move up 12
        13: move up 14
        switch: switch marble position with opponents marble
*/

const possibleMoves = {
  'A': 'Click on a marble to go out, or move either one or eleven steps.',
  '2': 'Click on a marble to move two steps.',
  '3': 'Click on a marble to move three steps.',
  '4': 'Click on a marble and its destination to move four steps forwards or backwards.',
  '5': 'Click on a marble to move five steps.',
  '6': 'Click on a marble to move six steps.',
  '7': 'Click on a marble to move seven steps. Each step needs to be performed individually on your marbles.',
  '8': 'Click on a marble to move eight steps.',
  '9': 'Click on a marble to move nine steps.',
  '10': 'Click on a marble to move ten steps.',
  'Ja': 'Choose an arbitrary marble to switch with one of yours. You cannot exchange locked marbles.',
  'Q': 'Click on a marble to move 12 steps.',
  'K': 'Click on a marble to go out, or move 13 steps.',
  'Jo': 'Choose a card that the joker imitates.'
}

function Controls(props) {
  // var selectedCardString, 
  var possibleMoveString

  if (props.selectedCard !== undefined) {
    // selectedCardString = props.selectedCard.color + '' + props.selectedCard.value
    possibleMoveString = possibleMoves[props.selectedCard.value]
  } else {
    // selectedCardString = ''
    possibleMoveString = ''
  }

  var handleClick = event => {
    event.preventDefault()
    props.startGame()
  }

  return (
    <div className="controls-box">
      <div className="instruction-box">
        {props.gameState < 2 &&
          <button onClick={handleClick}> Start game </button>
        }
      </div>

      <div className="instruction-box">
        {props.roundState === 2
          ? <p className="instruction-text">click on a card to swap.</p>
          : <p className="instruction-text">{possibleMoveString}</p>
        }
      </div>
      <Hand
        cards={props.cards}
        cardClicked={props.cardClicked}
        selectedCardIndex={props.selectedCardIndex}
      />
      
      {props.selectedCard && props.selectedCard.value === 'Jo' && 
        <select onChange={event => props.setJokerAction(event.target.value)}>
          {props.selectedCard.actions.map(action =>
            <option value={action}>{action}</option>
          )}
        </select>
      } 
      {props.roundState === 2 &&
        <button className='button'
          onClick={props.swapCard}
          disabled={props.selectedCardIndex === null || props.cardSwapConfirmed}>
          Confirm
        </button>
      }
      { props.playerIsActive && props.roundState === 4 && 
      // allows the player to fold if it's his turn and the cards have been exchanged
        <button className='button'
          onClick={props.fold}>
          Fold
        </button>
      }
    </div>
  )
}

export default Controls;
