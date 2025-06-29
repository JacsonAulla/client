import React, { useEffect, useState } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import Square from './Square';
import { Patterns } from '../WinningPatterns';

function Board({ result, setResult }) {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState(null); // X u O
    const [turn, setTurn] = useState("X");

    const { channel } = useChannelStateContext();
    const { client } = useChatContext();

    // Asignar "X" u "O" al jugador local
    useEffect(() => {
        const { playerX, playerO } = channel.data || {};
        const me = client.userID;

        if (playerX && playerO) {
            const assignedPlayer = me === playerX ? "X" : "O";
            setPlayer(assignedPlayer);
        }
        }, [channel, client.userID]
    );

  // Verificar ganador o empate cada vez que el tablero cambie
    useEffect(() => {
        checkIfTie();
        checkWin();
    }, [board]);

    const chooseSquare = async (square) => {
        if (turn !== player || board[square] !== "" || result.state !== "none") return;

        const nextTurn = player === "X" ? "O" : "X";
        setTurn(nextTurn);

        await channel.sendEvent({
        type: "game-move",
        data: { square, player },
        });

        setBoard((prevBoard) =>
        prevBoard.map((val, idx) => {
            if (idx === square && val === "") {
            return player;
            }
            return val;
        })
        );
    };

    const checkWin = () => {
        Patterns.forEach((pattern) => {
        const first = board[pattern[0]];
        if (first === "") return;

        const isWin = pattern.every((idx) => board[idx] === first);

        if (isWin) {
            setResult({ winner: first, state: "won" });
        }
        });
    };

    const checkIfTie = () => {
        if (board.every((square) => square !== "")) {
            setResult({ winner: "none", state: "tie" });
        }
    };

    useEffect(() => {
        const handleMove = (event) => {
            if (event.type === "game-move" && event.user.id !== client.userID) {
                const opponentMove = event.data;

                setTurn(player); // Sigue siendo tu turno después del del oponente

                setBoard((prevBoard) =>
                prevBoard.map((val, idx) => {
                    if (idx === opponentMove.square && val === "") {
                    return opponentMove.player;
                    }
                    return val;
                })
                );
            }

            if (event.type === "game-restart") {
                setBoard(["", "", "", "", "", "", "", "", ""]);
                setTurn("X");
                setResult({ winner: "none", state: "none" });
            }
        };

        channel.on(handleMove);

        return () => {
            channel.off("game-move", handleMove);
            channel.off("game-restart", handleMove);
        };
    }, [channel, client.userID, player]);

    const restartGame = async () => {
        setBoard(["", "", "", "", "", "", "", "", ""]);
        setTurn("X");
        setResult({ winner: "none", state: "none" });

        await channel.sendEvent({
            type: "game-restart",
        });
    };

    return (
        <>
            <div className="info">
                <h4>Eres: {player}</h4>
                <h4>Turno actual: {turn}</h4>
            </div>

            <div className="board">
                <div className="row">
                    <Square chooseSquare={() => chooseSquare(0)} val={board[0]} />
                    <Square chooseSquare={() => chooseSquare(1)} val={board[1]} />
                    <Square chooseSquare={() => chooseSquare(2)} val={board[2]} />
                </div>

                <div className="row">
                    <Square chooseSquare={() => chooseSquare(3)} val={board[3]} />
                    <Square chooseSquare={() => chooseSquare(4)} val={board[4]} />
                    <Square chooseSquare={() => chooseSquare(5)} val={board[5]} />
                </div>

                <div className="row">
                    <Square chooseSquare={() => chooseSquare(6)} val={board[6]} />
                    <Square chooseSquare={() => chooseSquare(7)} val={board[7]} />
                    <Square chooseSquare={() => chooseSquare(8)} val={board[8]} />
                </div>
            </div>

            {result.state !== "none" && (
                <div className="info">
                    <h3>{result.state === "won" ? `🎉 Ganador: ${result.winner}` : "🤝 Empate"}</h3>
                    <button onClick={restartGame} className="restart-button">Reiniciar Juego</button>
                </div>
            )}
        </>
    );
}

export default Board;
