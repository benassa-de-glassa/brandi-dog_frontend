import React from 'react'

// const tooltipText = [
//     {
//         '4': 'move 4 forward',
//         '-4': 'move 4 backward',
//     }
// ]

function Tooltip(props) {
    return (
        <div
            className='tooltip'
            style={{ 'top': props.tooltip.y, 'left': props.tooltip.x }}
        >
            { //props.selectedCard !== undefined 
              //&& props.selectedCard.actions.length > 1 
              // && 
              props.tooltipActions.map( action =>
                <button id={action} key={action} type="button" className='movebutton'
                onClick={() => props.tooltipClicked(action)}>
                   <span aria-hidden="true">{action}</span>
               </button>        
              )
            }
            <button 
                id="close-tooltip" 
                type="button" 
                className='close' 
                aria-label="Close"
                onClick={props.closeTooltip}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

export default Tooltip