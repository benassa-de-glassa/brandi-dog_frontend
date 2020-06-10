import React, { useState, Fragment } from 'react'

import { Link } from 'react-router-dom'

import UserLogin from './UserLogin'
import UserCreate from './UserCreate'

function TopBar(props) {
  var buttonValue = props.showMenu ? "Hide Menu" : "Show Menu"

  const [createUser, setCreateUser] = useState(false)

  return (
      <div className="topbar">
        <h1 className="ml-2 mr-2">Boomer Dog{'\u2122'}</h1>
        
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="10" stroke="black" strokeWidth="2" fill={props.socketConnected ? "green" : "red"} />
        </svg>


        <input type="button" className="top-bar-link" value={buttonValue} onClick={props.toggleMenu}/>


        <Link to='/users/login'>Login</Link>

        {
          !props.playerLoggedIn && !createUser &&
          <Fragment>
          <input type="button" className="top-bar-link mr-2 ml-2" value="Create new user" onClick={() => setCreateUser(true)}/>
          <UserLogin login={props.login}/>
          </Fragment>
        }
        {
          !props.playerLoggedIn && createUser &&
          <Fragment>
          <input type="button" className="top-bar-link mr-2 ml-2" value="Use existing user" onClick={() => setCreateUser(false)}/>
          <UserCreate createUser={props.createUser}/>
          </Fragment>
        }
        
        { 
          props.playerLoggedIn && 
          <Fragment>
          <span className="ml-auto mr-2">
                  Playing as  <strong>{props.player.username} (#{props.player.uid})</strong>
          </span>
          <input type="button" className="top-bar-link mr-2" value="Logout" onClick={props.logout}/>
          </Fragment> 
        }
      </div>
  )
}
  
export default TopBar;