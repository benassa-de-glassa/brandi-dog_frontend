import React, { useState, useEffect } from 'react'

import { socket } from '../../socket'
import { get, postData } from '../../paths'

import { DEBUG } from '../../config'

var GameViewer = function(props) {
    // use hooks because cooler!?
    const [gameList, setGameList] = useState([])
    const [createGame, setCreateGame] = useState(false)
    const [input, setInput] = useState("")
    const [selectedRow, setSelectRow] = useState()
    const [joinedGame, setJoinedGame] = useState(false)
    const [error, setError] = useState("")

    const updateGameList = async function() {
        const response = await get('games')
        const responseJson = await response.json()
        setGameList(responseJson)
    }

    const handleCreateGameInput = (event) => setInput(event.target.value)
    const handleCreateGameSubmit = async (event) => {
        event.preventDefault()
        var relURL = 'games'
        if (DEBUG) { relURL += '?debug=true' }

        const response = await postData(relURL, {
            player: props.player, 
            game_name: input
        })
        const responseJson = await response.json()
        if (response.status === 200) {
            updateGameList()
            joinGame(responseJson.game_id)
            setCreateGame(false)
        } else {
            console.log(responseJson.detail)
        }
    }

    const joinGame = async (gameID) => {
        const response = await postData('games/' + gameID + '/join', 
            props.player
        )
        //const responseJson = await response.json()
        if (response.status === 200) {
            socket.emit('join-game', 
                {
                    player: props.player,
                    game_id: gameID
                }
            )
            props.setGameID(gameID)
            setJoinedGame(gameID)
        } else {
            try {
                let responseJson = await response.json()
                setError(responseJson.detail)
            } catch (err) {
                console.warn(err.message)
            }
        }
        updateGameList()
    }

    // like componendDidMount
    useEffect(() => {
        updateGameList()
    }, [])

    return(
        <div id="game-viewer">
            <strong>Game List</strong>
            { error && 
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
                {gameList.map( (game, index) => 
                    <tr key={game.game_name} onClick={() => setSelectRow(index)} 
                            className={(index === selectedRow ? "selected-row " : "") + (game.game_id === joinedGame ? 'joined-row' : "")}>
                        <td>{game.game_name}</td>
                        <td>{game.host.name}</td>
                        <td>{Object.values(game.players).map(player => player.name).join(', ')}</td>
                    </tr>
                )}
                </tbody>
            </table>
            { }
            <input type='button' className="mr-auto" 
                    onClick={() => joinGame(gameList[selectedRow].game_id)} 
                    value='Join' disabled={selectedRow === undefined || joinedGame}/>
            <input type='button' className="mr-auto" 
                    onClick={() => alert('not implemented yet. complain on github')} 
                    value='Leave' disabled={!joinedGame}/>
            <input type='button' onClick={updateGameList} value='Update'/>
            <input type='button' onClick={() => setCreateGame(true)} value='New Lobby' disabled={joinedGame || !props.playerLoggedIn}/>
            {
                createGame && 
                <form className='ml-auto mr-2' onSubmit={handleCreateGameSubmit}>
                    <label className='mr-1'>
                    Enter a name: </label>
                    <input type='text' className='mr-1' value={input} onChange=
                {handleCreateGameInput} placeholder='Enter game name'/>
                    
                    <input type='submit' value='Create Game' />
                </form>
            }
            
        </div>
    )
}

export default GameViewer;