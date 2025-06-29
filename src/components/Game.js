import React, { useState } from 'react';
import Board from './Board';

function Game({channel}) {

    const [playersJoined, setPlayersJoined] = useState(
        channel.state.watcher_count === 2
    );
    const [result, setResult] = useState({ winner: "none", state: "none" });

    channel.on("user.watching.start", (event) => {
        setPlayersJoined(event.watcher_count === 2);
    });

    if (!playersJoined) {
        return <div>Experando al segundo jugador</div>
        
    }
    return (
        <div className='gameContainer'>
            <Board result={result} setResult={setResult} />
            {/*<chat>*/}
            {/*<salir>*/}
        </div>
    );
}

export default Game;