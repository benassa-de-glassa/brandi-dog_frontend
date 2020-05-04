import React from 'react'

var GameViewer = function(props) {
    return(
        <div id="game-viewer">
            <table id="game-list-table">
                <tr>
                    <th>Game id</th>
                    <th>Name</th>
                    <th>Players</th>
                </tr>
                
            {props.games.map( game => 
                <tr>
                    <td>{game}</td>
                </tr>
            )}
            </table>
        </div>
    )
}

export default GameViewer;