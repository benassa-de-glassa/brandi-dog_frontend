import React from 'react'

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
  'A': 'Click on a marble to go out, click on a marble and its destination to move one or eleven',
  '2': 'Click on a marble to move two.',
  '3': 'Click on a marble to move three.',
  '4': 'Click on a marble and its destination to move four forwards or backwards.', 
  '5': 'Click on a marble to move five.',
  '6': 'Click on a marble to move six.',
  '7': 'Click on a marble to move seven steps. Each step needs to be performed individually on your marbles.',
  '8': 'Click on a marble to move eight.',
  '9': 'Click on a marble to move nine.',
  '10': 'Click on a marble to move ten.',
  'Ja': 'Choose an arbitrary marble to switch with one of yours. You cannot exchange locked marbles.',
  'Q': 'Move 12.',
  'K': 'Click on a marble to move 13 or go out.',
  'Jo': 'Not implemented yet, the joker can imitate any card.'
}

function Controls(props) {

  var selectedCardString, possibleMoveString

  if (props.selectedCard !== undefined) {
    selectedCardString = props.selectedCard.color + '' + props.selectedCard.value
    possibleMoveString = possibleMoves[props.selectedCard.value]
  } else {
    selectedCardString = ''
    possibleMoveString = ''
  }


  var handleClick = event => {
    event.preventDefault()
    props.startGame()
  }

  var chooseAction =event => {
    props.getAction(event.target.id)
  }

  return (
    <div className="controls-box">
      <div className="instruction-box"> 
      { !props.gameStarted &&
        <button onClick={handleClick}> Start game </button>
      }
      </div>

      <div className="instruction-box">
        <p className="instruction-text">{possibleMoveString}</p>
        {props.selectedCard !== undefined && props.selectedCard.actions.length > 1 && props.cards[props.selectedCardIndex].actions.map(action => 
          <button id={action} key={action} onClick={(event) => chooseAction(event)} > {action} </button>)}
      </div>
      <Hand 
          cards={props.cards} 
          cardClicked={props.cardClicked} 
          selectedCardIndex={props.selectedCardIndex}
      />
      
    </div>
    )
}
  
export default Controls;
  