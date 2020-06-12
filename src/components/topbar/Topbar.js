import React, { Fragment } from 'react'

import { Link, withRouter } from 'react-router-dom'

function TopBar(props) {
    return (
        <header>
            <svg className='ml-2' height="20" width="20">
                <circle cx="10" cy="10" r="10" stroke="black" strokeWidth="2" fill={props.socketConnected ? "green" : "red"} />
            </svg>
            <span className='topbar'>
                <Link
                    id='title'
                    className='top-bar-link ml-2 mr-2'
                    to='/'
                >Boomer Dog{'\u2122'}
                </Link>

                {/* <Link className="top-bar-link ml-2" to='/'>Home</Link> */}
                <Link className="top-bar-link ml-2" to='/about'>About</Link>

                <input type="button" className="top-bar-link ml-2" value={'Menu'} onClick={props.toggleMenu} />

                {props.playerLoggedIn
                    ?
                    <span className="ml-auto mr-2">
                        Playing as  <strong>{props.player.username} (#{props.player.uid})</strong>

                        <input type="button" className="top-bar-link ml-2 mr-2" value="Logout" onClick={props.logout} />
                    </span>
                    :
                    <Fragment>
                        <Link className='top-bar-link mr-2 ml-auto' to='/users/login'>Login</Link>
                        <Link className='top-bar-link mr-2' to='/users/create'>Create User</Link>
                    </Fragment>
                }
            </span>
        </header>
    )
}

export default withRouter(TopBar);