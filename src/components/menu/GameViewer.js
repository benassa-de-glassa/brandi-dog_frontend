import React, { useState, useEffect } from 'react'

import { socket } from '../../socket'
import { get, postData } from '../../paths'

var GameViewer = function(props) {
    // use hooks because cooler!?
    const [gameList, setGameList] = useState([])
    const [createGame, setCreateGame] = useState(false)
    const [input, setInput] = useState("")
    const [selectedRow, setSelectRow] = useState()
    const [joinedGame, setJoinedGame] = useState(false)
    const [error, setError] = useState("")

    const updateGameList = async function() {
        const responseJson = await get('games')
        setGameList(responseJson)
    }

    const handleCreateGameInput = (event) => setInput(event.target.value)
    const handleCreateGameSubmit = async (event) => {
        event.preventDefault()
        const responseJson = await postData('games', {
            player: props.player, 
            game_name: input
        })
        if ('game_id' in responseJson) {
            updateGameList()
            joinGame(responseJson.game_id)
            setCreateGame(false)
        } else {
            console.log(responseJson.detail)
        }
    }

    const joinGame = async (gameID) => {
        const responseJson = await postData('games/' + gameID + '/join', 
            props.player
        )
        if ('game_id' in responseJson) {
            socket.emit('join-game', 
                {
                    player: props.player,
                    game_id: gameID
                }
            )
            props.setGameID(gameID)
            setJoinedGame(gameID)
        } else {
            console.log(responseJson.detail)
            setError(responseJson.detail)
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
            { 
                props.playerLoggedIn && 
                <input type='button' onClick={() => setCreateGame(true)} value='New Lobby' disabled={joinedGame}/>
            }
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