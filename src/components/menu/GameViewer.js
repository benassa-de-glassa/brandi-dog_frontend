import React, { useState, useEffect } from 'react'

import { socket } from '../../socket'
import { get, postData } from '../../paths'

import { DEBUG } from '../../config'

var GameViewer = function (props) {
    // use hooks because cooler!?
    const [gameList, setGameList] = useState([])
    const [createGame, setCreateGame] = useState(false)
    const [input, setInput] = useState("")
    const [selectedRow, setSelectRow] = useState()
    const [error, setError] = useState("")


    const updateGameList = async function () {
        // this function is only called after pressing the update button
        // manually as the game list is updated using socket.io
        const response = await get('games')
        const responseJson = await response.json()
        setGameList(responseJson)
    }

    // let react control the input
    const handleCreateGameInput = event => setInput(event.target.value)
    
    const handleCreateGameSubmit = async event => {
        event.preventDefault() // don't use the default submit
        var relURL = 'games'
        if (DEBUG) { relURL += '?debug=true' } // adds 3 filler players

        const response = await postData(relURL, {
            player: props.player,
            game_name: input
        })
        const responseJson = await response.json()
        if (response.status === 200) {
            props.joinGameSocket(responseJson.game_token)
            setCreateGame(false)
        } else {
            console.log(responseJson.detail)
        }
    }

    // like componendDidMount
    useEffect(() => {
        socket.on('game-list', gameList => {
            setGameList(gameList)
        })
    }, [])

    return (
        <div id="game-viewer">
            <strong className='mb-1'>Game List</strong>
            {error &&
                <p className='error'>{error}</p>
            }
            <table id="game-list-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Host</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {gameList.map((game, index) =>
                        <tr key={game.game_name} onClick={() => { setSelectRow(index); setError('') }}
                            className={(index === selectedRow ? "selected-row " : "") + (game.game_id === props.joinedGame ? 'joined-row' : "")}>
                            <td>{game.game_name}</td>
                            <td>{game.host.name}</td>
                            <td>{Object.values(game.players).map(player => player.username).join(', ')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {}
            <input type='button' className="mr-auto"
                onClick={() => props.joinGame(gameList[selectedRow].game_id)}
                value='Join' disabled={!props.playerLoggedIn || selectedRow === undefined || props.joinedGame} />
            <input type='button' className="mr-auto"
                onClick={props.leaveGame}
                value='Leave' disabled={!props.joinedGame} />
            <input type='button' onClick={updateGameList} value='Update' />
            <input type='button' onClick={() => setCreateGame(true)} value='New Lobby' disabled={props.joinedGame || !props.playerLoggedIn} />
            {
                createGame &&
                <form className='ml-auto mr-2' onSubmit={handleCreateGameSubmit}>
                    <label className='mr-1'>
                        Enter a name: </label>
                    <input type='text' className='mr-1' value={input} onChange=
                        {handleCreateGameInput} placeholder='Enter game name' />

                    <input type='submit' value='Create Game' />
                </form>
            }

        </div>
    )
}

export default GameViewer;