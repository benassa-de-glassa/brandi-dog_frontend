import React from 'react'

function Hand(props) {
  return (
    <div className="hand">
      {props.cards.map( (card, index) => 
        <div 
          key={card.uid} 
          className={ (index === props.selectedCardIndex) ? "card card-selected" : "card" }
          onClick={ () => props.cardClicked(index) }
        >
          <h3 className="card-value">{card.value}</h3>
        </div>
      )}
    </div>
    )
}
  
export default Hand;
  