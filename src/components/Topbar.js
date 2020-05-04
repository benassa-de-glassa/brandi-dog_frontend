import React from 'react'

function TopBar(props) {

  return (
      <div className="topbar">
        <h1 className="ml-2 mr-2">Boomer Dog{'\u2122'}</h1>
        
        <svg height="35" width="35">
          <circle cx="20" cy="20" r="10" stroke="black" strokeWidth="2" fill={props.socketConnected ? "green" : "red"} />
        </svg>
          
        <span className="ml-auto mr-2">
                Playing as  <strong>{props.player.name} (#{props.player.uid})</strong>
        </span>
        <input className="button mr-2" type="button" value="Quit"/>
      </div>
  )
}
  
export default TopBar;