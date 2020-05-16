import React from 'react'

import Hand from './Hand'
import './controls.css'

const possibleMoves = {
  'A': 'Move one, eleven, or go out.',
  '2': 'Move two.',
  '3': 'Move three.',
  '4': 'Move four forwards or backwards.', 
  '5': 'Move five.',
  '6': 'Move six.',
  '7': 'Move seven steps. Each step can be performed individually on different marbles.',
  '8': 'Move eight.',
  '9': 'Move nine.',
  '10': 'Move ten.',
  'Ja': 'Choose an arbitrary marble to switch with one of yours. You cannot exchange locked marbles.',
  'Q': 'Move 12.',
  'K': 'Move 13 or go out.'
}

function Controls(props) {

  var selectedCardString, possibleMoveString

  if (props.selectedCardIndex !== null) {
    const selectedCard = props.cards[props.selectedCardIndex]
    selectedCardString = selectedCard.color + '' + selectedCard.value
    possibleMoveString = possibleMoves[selectedCard.value]
  } else {
    selectedCardString = ''
    possibleMoveString = ''
  }


  var handleClick = event => {
    event.preventDefault()
    props.startGame()
  }

  return (
    <div className="controls-box">
      <div className="instruction-box"> 
        <button onClick={handleClick}> Start game </button>
      </div>

      <div className="instruction-box">
        <p className="instruction-text">Currently selected card: {selectedCardString}</p>
        <p className="instruction-text">{possibleMoveString}</p>
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
  