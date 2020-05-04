import React from 'react'

import './board.css'

var boardData = require("./boarddata.json")

function Board(props) {
  var height = 800;
  var width = 800;

  // playerList = props.playerList
  var playerList = [{name: "Player 1"}, {name: "Player 2"}, {name: "Player 3"}, {name: "Player 4"}] 
  var top3cards = [
    {color: "blue", number: 3},
    {color: "blue", number: 4},
    {color: "red", number: 7}
  ]

  var radius = 12;
  var outerRadius = 18;

  var onClickHandler = function (d) {
    console.log(d)
  }

  return (
    <div className="svg-container">
      <svg id="board" className="svg-content-responsive" viewBox={"0 0 " + width + " " + height}>
       
        {/* add players */}
        <svg x="0%" y="0%" height="20%" width="20%">
          <g transform={"rotate(-45 " + 0.2*0.95*width + " " + (0.25*0.2*height) + ")"}>
           <rect className="player-box" x="5%" y="5%" width="90%" height="20%" style={{stroke:"blue"}} />
           <text className="player-name" x="10%" y="20%" >{playerList[0].name}</text>
          </g>
        </svg>

        <svg x="80%" y="0%" height="20%" width="20%">
          <g transform={"rotate(45 " + 0.2*0.05*width + " " + 0.25*0.2*height + ")"}>
            <rect className="player-box" x="5%" y="5%" width="90%" height="20%" style={{stroke:"red"}} />
            <text  x="10%" y="20%" className="player-name">{playerList[3].name}</text>
          </g>
        </svg>

        <svg x="80%" y="80%" height="20%" width="20%">
          <g transform={"rotate(-45 " + 0.2*0.05*width + " " + 0.2*0.75*height + ")"}>
            <rect className="player-box" x="5%" y="75%" width="90%" height="20%" style={{stroke:"yellow"}}/>
            <text  x="10%" y="90%" className="player-name">{playerList[2].name}</text>
          </g>
        </svg>

        <svg x="0%" y="80%" height="20%" width="20%">
          <g transform={"rotate(45 " + 0.2*0.95*width + " " + 0.2*0.75*height + ")"}>
            <rect className="player-box" x="5%" y="75%" width="90%" height="20%" style={{stroke:"green"}}/>
            <text  x="10%" y="90%" className="player-name">{playerList[1].name}</text>
          </g>
        </svg>
        {/* build steps for the path around the board */}
        {boardData.steps.map(
          data =>
            <circle 
              key={data.id}
              className="step"
              id={"step-" + data.id} 
              cx={data.x}
              cy={data.y}
              r={radius}
              onClick={() => onClickHandler(data.id)}
            />
        )}
        {/* draw outer circles */}
        {boardData.outer.map(
          data =>
            <circle 
              key={"out " + data.x + " " + data.y}
              className={"step out out-" + data.color}
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
              className="step"
              id={"home" + data.color + "-" + data.id} 
              cx={data.x}
              cy={data.y}
              r={radius}
              onClick={() => onClickHandler(data.color + " home " + data.id)}
            />
        )}
        {/* draw houses */}
        {boardData.houses.map(
          data =>
            <circle 
              key={"house " + data.x + " " + data.y}
              className="step"
              id={"house" + data.color + "-" + data.id} 
              cx={data.x}
              cy={data.y}
              r={radius}
              onClick={() => onClickHandler(data.color + " house " + data.id)}
            />
        )}
        {/* top card */}
        {/* <path className="card-path" d="M305,315 h90 a10,10 0 0 1 10,10 v150 a10,10 0 0 1 
        -10,10 h-90 a10,10 0 0 1 -10,-10 v-150 a10,10 0 0 1 10,-10 z" /> 
        <text className="card-number" x="310" y="365">7</text> */}
        
        <path className="card-path"  d="M355,315 h90 a10,10 0 0 1 10,10 v150 a10,10 0 0 1 
        -10,10 h-90 a10,10 0 0 1 -10,-10 v-150 a10,10 0 0 1 10,-10 z" /> 
        <text className="card-number" x="360" y="365">7</text>

        {/* <path className="card-path" d="M405,315 h90 a10,10 0 0 1 10,10 v150 a10,10 0 0 1 
        -10,10 h-90 a10,10 0 0 1 -10,-10 v-150 a10,10 0 0 1 10,-10 z" /> 
        <text className="card-number" x="410" y="365">7</text> */}
      </svg>
    </div>
  )
}
  
export default Board;
  