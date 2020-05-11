import React from 'react'

import Hand from './Hand'
import './controls.css'

function Controls(props) {

  var selectedCardString;
  if (props.selectedCardIndex !== null) {
    const selectedCard = props.cards[props.selectedCardIndex]
    selectedCardString = selectedCard.color + " " + selectedCard.value
  } else {
    selectedCardString = ""
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
        <p className="instruction-text">Here comes a user message such as play card</p>
        <p className="instruction-text">Currently selected card: {selectedCardString}</p>
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
  