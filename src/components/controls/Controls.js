import React from 'react'

import Hand from './Hand'
import './controls.css'

function Controls(props) {
  return (
    <div className="controls-box">
      <div className="instruction-box">
        <p className="instruction-text">Here comes a user message such as play card</p>
      </div>
      <Hand cards={props.cards} cardClicked={props.cardClicked}/>
    </div>
    )
}
  
export default Controls;
  