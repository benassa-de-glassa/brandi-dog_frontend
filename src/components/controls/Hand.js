import React from 'react'

function Hand(props) {
  return (
    <div className="hand">
      {props.cards.map( card => 
        <div key={card.uid} className="card" onClick={ () => props.cardClicked(card) }><h3 className="card-value">{card.value}</h3></div>
      )}
    </div>
    )
}
  
export default Hand;
  