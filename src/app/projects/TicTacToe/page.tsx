"use client"
import { Navbar } from "@/components";
import { Button } from "@material-tailwind/react";
import { Box, padding } from "@mui/system";
import React from "react";

import { play, global_board, curr_board, move_count, set_curr_board, set_move_count, print_board, set_global_board, MIN_EVAL } from "./agent.js";
import { Modal, Typography } from "@mui/material";

export default function Portfolio() {
    const [cheatMode, setCheatMode] = React.useState(false);
    const [player, setPlayer] = React.useState("X");
    const [values, setValues]= React.useState(Array(9*9).fill(""));
    const [hoveredSquare, setHoveredSquare] = React.useState<number | null>(null);
    const [currentSubBoard, setCurrentSubBoard] = React.useState<number | null>(null);
    const [move_evals, setMoveEvals] = React.useState<number[]>(Array(9).fill(0));
    
    // TODO random first two/three moves setup (and button)
    // DONE AI move after player move
    // DONE indicate which sub-board is active
    // TODO indicate when game is over
    function getEnemy() {
        return player === "X" ? "O" : "X";
    }
    const [showWinModal, setShowWinModal] = React.useState(false);
    const [winner, setWinner] = React.useState<string | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);

    function handleGameOver(winner: string) {
        setWinner(winner);
        setIsAnimating(true);
        setTimeout(() => {
            setShowWinModal(true);
            setIsAnimating(false);
        }, 1000);
    }

    const WinModal = () => (
        <Modal
            open={showWinModal}
            onClose={() => setShowWinModal(false)}
            aria-labelledby="game-over-modal"
            className="flex items-center justify-center"
        >
            <Box className="bg-white p-8 rounded-lg shadow-xl text-center outline-none">
                <Typography variant="h4" className="mb-4">
                    {winner === player ? 'Congratulations!' : 'Game Over!'}
                </Typography>
                <Typography variant="body1" className="mb-4">
                    {winner === player ? 'You won!' : 'The AI won!'}
                </Typography>
                <Button
                    color="blue"
                    onClick={() => {
                        setShowWinModal(false);
                        setValues(Array(9*9).fill(""));
                        setPlayer("X");
                        setCurrentSubBoard(null);
                    }}
                >
                    Play Again
                </Button>
            </Box>
        </Modal>
    );

    function updateBoard(prevTurn: number, new_subBoard: number) {
        // want to update global_board and current_board from agent.js
        // global_board = Array(10).fill().map(() => Array(10).fill(0))
        global_board.map(() => Array(10).fill(0))
        console.log(global_board)
        const new_board = Array(10).fill(0).map(() => Array(10).fill(0));
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (values[i*9 + j] === getEnemy()) {
                    new_board[i+1][j+1] = 1;
                } else if (values[i*9 + j] === player) {
                    new_board[i+1][j+1] = 2;
                } else {
                    new_board[i+1][j+1] = 0;
                }
                // console.log(values[i*9 + j], new_board[i+1][j+1])
            }
        }
        // set prev turn
        new_board[parseInt(prevTurn / 9) + 1][(prevTurn % 9) + 1] = player === "X" ? 2 : 1;
        set_global_board(new_board);
        print_board(global_board)
        set_curr_board(new_subBoard + 1);
        set_move_count(values.filter(v => v !== "").length);
        console.log('Current board')
        console.log(values);
        console.log("Updated board:");
        console.log(global_board);
        console.log("Current board: " + curr_board);
        console.log("Move count: " + move_count);
        let move_evals = play()
        // if number then play that move
        if (typeof move_evals === 'number') {
            let temp_evals = Array(9).fill(0);
            temp_evals[move_evals - 1] = 1;
            setMoveEvals(temp_evals);
            return move_evals - 1
        }
        // skip first eval
        setMoveEvals(move_evals.slice(1));
        let best_evaluation = Math.max(...move_evals)
        let chosen_move = move_evals.indexOf(best_evaluation)
        // takeTurn(new_subBoard * 9 + ai_move - 1, player, true);
        return chosen_move - 1
    }

    function checkWin(board: string[]) {
        const win_positions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for (let positions of win_positions) {
            const [a,b,c] = positions;
            if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    function checkAllBoards(valArray: string[] = [...values]) {
        for (let i = 0; i < 9; i++) {
            const subBoard = valArray.slice(i*9, i*9 + 9);
            const winner = checkWin(subBoard);
            if (winner) {
                console.log(`Player ${winner} wins sub-board ${i}`);
                handleGameOver(winner);
            }
        }
    }

    function takeTurn(i: number, player: string, isAI: boolean = false) {
        // AI to take turn
        setCurrentSubBoard(i % 9);
        console.log(`AI taking turn in sub-board ${i % 9}`);
        // find first empty square in that sub-board
        let newValues = [...values];
        newValues[i] = player;
        setValues(newValues);
        // setPlayer(player === "X" ? "O" : "X")
        checkAllBoards()
        if (!isAI) {
            let ai_move = updateBoard(i, (i % 9))
            newValues[ai_move + (i % 9) * 9] = getEnemy();
            setValues(newValues);
            setPlayer(getEnemy() === "X" ? "O" : "X")
            setCurrentSubBoard(ai_move % 9);
            console.log(`Player ${getEnemy()} played in sub-board ${ai_move % 9}`);


        }
        // TODO check for win conditions
        checkAllBoards(newValues)
        // TODO if sub-board is full, allow next player to play anywhere
        // TODO if game is over, indicate winner and disable further moves
    }

    const squares = Array(9*9).fill("").map((_, i) => (
        <Button 
        onTouchMoveCapture={() => setHoveredSquare(i % 9)}
        onMouseEnter={() => setHoveredSquare(i % 9)}
        onMouseLeave={() => setHoveredSquare(null)}
        onClick={() => {
            console.log(`Clicked on square ${i}`);
            let newValues = [...values];
            if (cheatMode) {
                // rotate between X, O, and empty
                newValues[i] = newValues[i] === "" ? "X" : newValues[i] === "X" ? "O" : "";
                setValues(newValues);

            } else {
                if (newValues[i] === "") {
                    // if currentSubBoard is set, only allow play in that sub-board
                    if (currentSubBoard !== null && (parseInt(i / 9) !== currentSubBoard)) {
                        console.log(`Must play in sub-board ${currentSubBoard} not ${i / 9}`);
                        return;
                    } else {
                        takeTurn(i, player)
                    }
                }
            }
        }}
        key={i} color={
            // if cheat mode, color is orange
            cheatMode ? "orange" : 
            // if not cheat mode, color is blue if X, red if O, gray if empty
            values[i] === player ? "blue" : values[i] === getEnemy() ? "red" : "blue-gray"
                
        }
        variant={currentSubBoard === parseInt(i/9) ? "outlined" : "filled"}
        className="w-16 h-16 border flex items-center justify-center text-2xl font-bold">
            {values[i]}

        </Button>
        // <div key={i} className="w-16 h-16 border flex items-center justify-center text-2xl font-bold">
        //     {/* {i % 2 === 0 ? 'X' : 'O'} */}
        //     {i}: {_}
        // </div>
    ));

  return (
    <>
      <Navbar />
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">Super Tic Tac Toe Project</h1>
            <p className="mb-4">This is an interface for an algorithm that plays Super Tic Tac Toe, built with React and TypeScript.</p>
        </div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Super Tic Tac Toe</h2>
            <p className="mb-4">A 3x3 grid of Tic Tac Toe boards. The game is won by the first player to claim 3-in-a-row in <b>any</b> sub-board</p>
            <p className="mb-4 text-gray-600">The square you play within a sub-board determines which sub-board the opponent must play in</p>
            <p className="text-gray-600">Click a square to place your <b >{player}</b>. Then the AI will evaluate and take their turn.</p> 
        </div>
        {showWinModal && <WinModal />}
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 text-center" style={{ width: '200px' }}>
            <h2 className="text-2xl font-semibold mb-2">AI Move Evaluations</h2>
            <p className="mb-4 text-gray-600">The AI evaluates each possible move and selects the one with the highest score.</p>
            <div className="grid grid-cols-3 gap-1">
            {Array(9).fill(0).map((_, i) => {
                let evaluation = move_evals[i]
                let max_eval = 0
                if (evaluation > 0) {
                max_eval = Math.max(...move_evals.filter(v => v > 0).map(v => Math.abs(v)))
                } else {
                max_eval = Math.max(...move_evals.filter(v => v <= 0).map(v => Math.abs(v)))
                }
                let min_eval = 0
                let height = 0;
                if (max_eval !== min_eval) {
                height = Math.abs(evaluation) / max_eval * 100
                } else {
                height = 50;
                }
                let darkness = 100
                if (Math.abs(evaluation) < 100) {
                darkness = 300;
                } else if (Math.abs(evaluation) < 300) {
                darkness = 400
                } else if (Math.abs(evaluation) < 500) {
                darkness = 500
                } else if (Math.abs(evaluation) < 700) {
                darkness = 500
                } else if (Math.abs(evaluation) < 900) {
                darkness = 800
                } else {
                darkness = 900
                }
                return (
                <div key={i} className="w-full bg-gray-200" style={{height: '50px', position: 'relative'}}>
                    <div className={`absolute bottom-0 left-0 w-full ${evaluation == MIN_EVAL ? ("") : evaluation > 0 ? 'bg-blue' : 'bg-red'}-${darkness}`} style={{height: `${height}%`}}></div>
                    <div className="absolute top-0 left-0 w-full text-xs text-center">{evaluation == MIN_EVAL ?'invalid' : Math.round(evaluation * 100) / 100}</div>
                </div>
                )
            })}
            </div>
        </div>
        
        <div className="grid grid-cols-3 gap-8" style={{width: '700px', margin: '0 auto', marginBottom: '40px'}}> 
            {Array(9).fill(9).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 mb-4 rounded-md" style={{ margin: '0 auto', padding: '2px', paddingRight: '13px', backgroundColor: (hoveredSquare === i && !cheatMode) ? '#e96d6d7e' : 'white' }}> 
                {squares[i*9 + 0]}
                {squares[i*9 + 1]}
                {squares[i*9 + 2]}
                {squares[i*9 + 3]}
                {squares[i*9 + 4]}
                {squares[i*9 + 5]}
                {squares[i*9 + 6]}
                {squares[i*9 + 7]}
                {squares[i*9 + 8]}
            </div>
        ))}
        </div>
        <div className="text-center mb-8">
            <span>
            <Button onClick={() => {
                setCheatMode(!cheatMode)
            }} color={cheatMode ? "blue" : "orange"} variant="outlined">
                {cheatMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </Button>
            </span>
            {cheatMode && <p className="mt-2 text-red-600">Edit/Cheat mode is enabled. You can play in any sub-board and toggle any square.</p>}
            {cheatMode && <p className="mt-2 text-red-600">Turn edit mode off to submit a move and continue the game</p>}
            
        </div>
        <div className="text-center mb-8">
                <Button onClick={() => {
                    setValues(Array(9*9).fill(""));
                    setPlayer("X");
                    setCurrentSubBoard(null);
                }} color="red" variant="outlined">
                    Reset Game
                </Button>

        </div>
        <div className="text-center mb-8">
            <Button onClick={() => setPlayer(player === "X" ? "O" : "X")} color="blue" variant="outlined" className="mb-8">
                Change Player (Current: {player})
            </Button>
        </div>
        <div className="container mx-auto p-8">
            <h2 className="text-2xl font-bold mb-4">About the Project</h2>
            <p className="mb-4">This project was built using React and TypeScript to create an interactive interface for playing Super Tic Tac Toe. The game logic is designed to handle the unique rules of Super Tic Tac Toe, where each move influences the opponent's next possible moves.</p>
            <p className="mb-4">The AI opponent is designed to evaluate the game state and make strategic decisions based on the current board configuration. The interface allows players to easily visualize the game state, including which sub-board they are required to play in next.</p>
            <p className="mb-4">Feel free to explore the code and modify the AI logic to create different strategies for playing Super Tic Tac Toe!</p>
        </div>
    <div className="h-32"></div>
    {/* spacer at bottom */}
    <div className="bg-gray-100 text-center p-4 text-gray-600">
        &copy; 2025 James Diefenbach. All rights reserved.
    </div>
    </>
  );
}
