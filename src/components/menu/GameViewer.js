import React from 'react'

var GameViewer = function(props) {
    return(
        <div id="game-viewer">
            <table id="game-list-table">
                <thead>
                    <tr>
                        <th>Game id</th>
                        <th>Name</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                {props.games.map( game => 
                    <tr key={game.id}>
                        <td>{game.id}</td>
                        <td>{game.name}</td>
                        <td>{game.players.join(', ')}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}

export default GameViewer;