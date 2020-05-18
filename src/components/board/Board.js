import React, { useState } from 'react'

import './board.css'

const boardData = require("./boarddata.json")

function Board(props) {
  const height = 800;
  const width = 800;

  const [tooltip, setTooltip] = useState({x: 0, y: 0})

  var playerList = [...props.playerList, '', '', '', ''] // make sure this list is at least 4 long.. players are added to the beginning
  var topCard = {color: "blue", number: 3}

  var homeOccupation = new Array(16);
  var stepOccupation = new Array(64);
  var houseOccupation = new Array(16);
  
  // place the marbles
  props.marbleList.forEach(marble => {
    // negative positions correspond to home
    if (marble.position < 0){
      homeOccupation[-(marble.position +1)] = marble
    } else if (marble.position >= 1000){
      houseOccupation[marble.position - 1000] = marble
    }
    else {
      stepOccupation[marble.position] = marble
    }
  });

  const radius = 12;
  const outerRadius = 18;

  var onClickHandler = function (data) {
    let marble
    if (data.id < 0){
      marble = homeOccupation[-data.id -1]
    } else if (data.id >= 1000){

    }
    else{
      marble = stepOccupation[data.id]
    }
    if (marble !== undefined){
      props.marbleClicked(marble)
    }
    if (props.selectedCardRequiresTooltip) {
      setTooltip({x: data.x, y: data.y})
    } 
  }

  var playerBoxClicked = function (d) {
    console.log("player box " + d + " clicked!")
  }

  const playerHomeClicked = function (d) {
    props.marbleClicked()
  }

  return (
    <div className="svg-container">
      <svg id="board" className="svg-content-responsive" viewBox={"0 0 " + width + " " + height}>
       
        {/* add players */}
        <svg x="0%" y="0%" height="20%" width="20%">
          <g transform={"rotate(-45 " + 0.2*0.95*width + " " + (0.25*0.2*height) + ")"}>
           <rect 
              className="player-box" x="5%" y="5%" 
              width="90%" height="20%" style={{stroke:"blue"}} 
              onClick={ () => playerBoxClicked(1) }
          />
           <text className="player-name" x="10%" y="20%" >{playerList[0].name}</text>
          </g>
        </svg>

        <svg x="80%" y="0%" height="20%" width="20%">
          <g transform={"rotate(45 " + 0.2*0.05*width + " " + 0.25*0.2*height + ")"}>
            <rect 
                className="player-box" x="5%" y="5%" 
                width="90%" height="20%" style={{stroke:"red"}}
                onClick={ () => playerBoxClicked(3) } 
            />
            <text  x="10%" y="20%" className="player-name">{playerList[3].name}</text>
          </g>
        </svg>

        <svg x="80%" y="80%" height="20%" width="20%">
          <g transform={"rotate(-45 " + 0.2*0.05*width + " " + 0.2*0.75*height + ")"}>
            <rect 
                className="player-box" x="5%" y="75%" 
                width="90%" height="20%" style={{stroke:"yellow"}}
                onClick={ () => playerBoxClicked(2) }
            />
            <text  x="10%" y="90%" className="player-name">{playerList[2].name}</text>
          </g>
        </svg>

        <svg x="0%" y="80%" height="20%" width="20%">
          <g transform={"rotate(45 " + 0.2*0.95*width + " " + 0.2*0.75*height + ")"}>
            <rect 
                className="player-box" x="5%" y="75%" 
                width="90%" height="20%" style={{stroke:"green"}}
                onClick={ () => playerBoxClicked(2) }
            />
            <text  x="10%" y="90%" className="player-name">{playerList[1].name}</text>
          </g>
        </svg>
        {/* build steps for the path around the board */}
        {boardData.steps.map(
          data =>
            <circle 
              key={data.id}
              className={stepOccupation[data.id] 
                          ? "step occupied occupied-" + stepOccupation[data.id].color
                          : "step"
              }
              id={"step-" + data.id} 
              cx={data.x}
              cy={data.y}
              r={radius}
              onClick={() => onClickHandler(data)}
            />
        )}
        {/* draw outer circles */}
        {boardData.outer.map(
          data =>
            <circle 
              key={"out " + data.x + " " + data.y}
              className={"out out-" + data.color}
              id={"step-" + data.id} 
              cx={data.x}
              cy={data.y}
              r={outerRadius}
            />
        )}
        {/* draw homes */}
        {boardData.homes.map(
          data =>
            <circle 
              key={"home " + data.x + " " + data.y}
              className={homeOccupation[-data.id-1] 
                ? "step occupied occupied-" + homeOccupation[-data.id-1].color
                : "step"
              }
              id={"home" + data.color + "-" + data.id} 
              cx={data.x}
              cy={data.y}
              r={radius}
              onClick={() => onClickHandler(data)}
            />
        )}
        {/* draw houses */}
        {boardData.houses.map(
          data =>
            <circle 
              key={"house " + data.x + " " + data.y}
              className={houseOccupation[data.id - 1000] 
                ? "step occupied occupied-" + houseOccupation[data.id - 1000].color
                : "step"
              }
              id={"house" + data.color + "-" + data.id} 
              cx={data.x}
              cy={data.y}
              r={radius}
              onClick={() => onClickHandler(data)}
            />
        )}
        {/* top card */}
        {/* <path className="card-path" d="M305,315 h90 a10,10 0 0 1 10,10 v150 a10,10 0 0 1 
        -10,10 h-90 a10,10 0 0 1 -10,-10 v-150 a10,10 0 0 1 10,-10 z" /> 
        <text className="card-number" x="310" y="365">7</text> */}
        
        <path className={"card-path card-" + topCard.color}  d="M355,315 h90 a10,10 0 0 1 10,10 v150 a10,10 0 0 1 
        -10,10 h-90 a10,10 0 0 1 -10,-10 v-150 a10,10 0 0 1 10,-10 z" /> 
        <text className="card-number" x="360" y="365">{topCard.number}</text>

        {/* <path className="card-path" d="M405,315 h90 a10,10 0 0 1 10,10 v150 a10,10 0 0 1 
        -10,10 h-90 a10,10 0 0 1 -10,-10 v-150 a10,10 0 0 1 10,-10 z" /> 
        <text className="card-number" x="410" y="365">7</text> */}
      </svg>
      <div className={props.selectedCardRequiresTooltip ? 'tooltip' : 'tooltip tt-not-visible'} style={{'top': tooltip.y, 'left': tooltip.x}}></div>
    </div>
  )
}
  
export default Board;
  