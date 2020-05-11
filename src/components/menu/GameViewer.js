import React, { useState, useEffect } from 'react'

import { socket } from '../../socket'
import { get, postData } from '../../paths'

var GameViewer = function(props) {
    const [gameList, setGameList] = useState([])
    const [createGame, setCreateGame] = useState(false)
    const [input, setInput] = useState("")
    const [selectedRow, setSelectRow] = useState()

    const updateGameList = async function() {
        const responseJson = await get('games')
        console.log(responseJson)
        setGameList(responseJson)
    }

    const handleInput = (event) => setInput(event.target.value)
    const handleSubmit = async (event) => {
        event.preventDefault()
        const responseJson = await postData('games', {
            player: props.player, 
            game_name: input
        })
        updateGameList()
    }

    const joinGame = () => {

    }

    // like componendDidMount
    useEffect(() => {
        updateGameList()
    }, [])

    return(
        <div id="game-viewer">
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
                    <tr key={game.game_name} onClick={() => setSelectRow(index)} className={index === selectedRow ? "selected-row" : ""}>
                        <td>{game.game_name}</td>
                        <td>{game.host.name}</td>
                        <td>{game.players.map(player => player.name).join(', ')}</td>
                    </tr>
                )}
                </tbody>
            </table>
            <input type='button' className="mr-auto" onClick={() => joinGame(true)} value='Join' disabled={!selectedRow}/>
            <input type='button' onClick={updateGameList} value='Update'/>
            { 
                props.playerLoggedIn &&
                <input type='button' onClick={() => setCreateGame(true)} value='New Lobby'/>
            }
            {
                createGame && 
                <form className='ml-auto mr-2' onSubmit={handleSubmit}>
                    <label className='mr-1'>
                    Enter a name: </label>
                    <input type='text' className='mr-1' value={input} onChange=
                {handleInput} placeholder='Enter game name'/>
                    
                    <input type='submit' value='Create Game' />
                </form>
            }
            
        </div>
    )
}

export default GameViewer;