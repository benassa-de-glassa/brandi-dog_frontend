import React, { Fragment } from 'react'

import UserRegistration from './UserRegistration'

function TopBar(props) {
  var buttonValue = props.showMenu ? "Hide Menu" : "Show Menu"

  return (
      <div className="topbar">
        <h1 className="ml-2 mr-2">Boomer Dog{'\u2122'}</h1>
        
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="10" stroke="black" strokeWidth="2" fill={props.socketConnected ? "green" : "red"} />
        </svg>


        <input type="button" className="top-bar-link" value={buttonValue} onClick={props.toggleMenu}/>

        { 
          props.playerLoggedIn && 
          <Fragment>
          <span className="ml-auto mr-2">
                  Playing as  <strong>{props.player.username} (#{props.player.uid})</strong>
          </span>
          <input type="button" className="top-bar-link mr-2" value="Logout" onClick={props.logout}/>
          </Fragment> 
        }
        { 
          !props.playerLoggedIn && 
          <UserRegistration login={props.login}/>
        } 
      </div>
  )
}
  
export default TopBar;