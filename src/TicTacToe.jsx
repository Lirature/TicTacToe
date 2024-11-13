import React, { useEffect, useState } from "react"

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null))
    const [isXNext, setIsXNext] = useState(true)
    const [player, setPlayer] = useState(null)
    const [gameOver, setGameOver] = useState(false)

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a]
            }
        }
        return null
    }

    const handleClick = (index) => {
        const squares = [...board]
        if (squares[index] || calculateWinner(squares) || gameOver) {
            return
        }
        squares[index] = player
        setBoard(squares)
        setIsXNext(!isXNext)
    }

    const minimax = (squares, depth, isMaximizing) => {
        const winner = calculateWinner(squares)
        if (winner === player) return -10 + depth
        if (winner && winner !== player) return 10 - depth
        if (squares.every((square) => square)) return 0

        if (isMaximizing) {
            let bestScore = -Infinity
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = player === "X" ? "O" : "X"
                    let score = minimax(squares, depth + 1, false)
                    squares[i] = null
                    bestScore = Math.max(score, bestScore)
                }
            }
            return bestScore
        } else {
            let bestScore = Infinity
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = player
                    let score = minimax(squares, depth + 1, true)
                    squares[i] = null
                    bestScore = Math.min(score, bestScore)
                }
            }
            return bestScore
        }
    }

    const getBestMove = (squares) => {
        const aiPlayer = player === "X" ? "O" : "X"
        const emptyIndices = squares.map((val, index) => (val === null ? index : null)).filter((val) => val !== null)

        const center = [4]
        const corners = [0, 2, 6, 8]
        const edges = [1, 3, 5, 7]

        for (let index of center) {
            if (emptyIndices.includes(index)) {
                return index
            }
        }

        for (let index of corners) {
            if (emptyIndices.includes(index)) {
                return index
            }
        }

        for (let index of edges) {
            if (emptyIndices.includes(index)) {
                return index
            }
        }

        let bestScore = -Infinity
        let move
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] === null) {
                squares[i] = aiPlayer
                let score = minimax(squares, 0, false)
                squares[i] = null
                if (score > bestScore) {
                    bestScore = score
                    move = i
                }
            }
        }
        return move
    }

    useEffect(() => {
        const winner = calculateWinner(board)
        if (winner || board.every((square) => square)) {
            setGameOver(true)
        } else if (!gameOver && !isXNext && player !== null) {
            const aiMove = getBestMove(board)
            if (aiMove !== undefined) {
                const squares = [...board]
                squares[aiMove] = player === "X" ? "O" : "X"
                setBoard(squares)
                setIsXNext(true)
            }
        }
    }, [board, isXNext, player, gameOver])

    const winner = calculateWinner(board)
    const status = winner ? `Winner: ${winner}` : gameOver ? `It's a draw!` : `Next player: ${isXNext ? "X" : "O"}`

    const handlePlayerSelect = (selectedPlayer) => {
        setPlayer(selectedPlayer)
        const firstMove = selectedPlayer === "O"
        setIsXNext(!firstMove)
        setBoard(Array(9).fill(null))
        setGameOver(false)

        if (firstMove) {
            const aiMove = getBestMove(Array(9).fill(null))
            const squares = Array(9).fill(null)
            squares[aiMove] = "X"
            setBoard(squares)
            setIsXNext(true)
        }
    }

    const handleRestart = () => {
        setBoard(Array(9).fill(null))
        setPlayer(null)
        setIsXNext(true)
        setGameOver(false)
    }

    return (
        <div style={{ textAlign: "center" }}>
            {!player ? (
                <div>
                    <h2>Please select your side:</h2>
                    <button onClick={() => handlePlayerSelect("X")}>X</button>
                    <button onClick={() => handlePlayerSelect("O")}>O</button>
                </div>
            ) : (
                <>
                    <div>{status}</div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 100px)",
                            gap: "5px",
                            margin: "20px auto",
                            justifyContent: "center",
                        }}
                    >
                        {board.map((value, index) => (
                            <button
                                key={index}
                                onClick={() => handleClick(index)}
                                style={{ width: "100px", height: "100px", fontSize: "24px" }}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleRestart}>Restart</button>
                </>
            )}
        </div>
    )
}

export default TicTacToe
