"use client"
import { Navbar } from "@/components";

const testPuzzle = 
`...........
.4.4.7.8.4.
...........
.5.5.7.7.4.
...........
6.4..7.7..5
........2..
...........
.3.7.7..5.3
.......1...
5..6.7..6.2`

const startPuzzles = {
    "4x4":
`4..4
....
5..5
....`
    , "5x5":
`4.8.6
.....
4.a.8
.....
4.9.5`
    , "6x6":
`.1..3.
5.6...
......
6.a.6.
......
4.7.4.`
    , "7x7":
`.2....5
4.4.5..
.......
7.5.6.7
.......
4.6.7.6
.......`
    , "9x9":
`.6..5..2.
...5.9..4
.........
.7.6.5...
......2.6
.6.......
...6.7..7
.........
.6.8.5..2`
    , "12x12":
`.3.8..7..5.5
.......2....
3..b..5..5.7
............
.4.9.6.7.8.4
............
.....5.7.5..
.5.4....3..5
4.7..7.6.6..
............
3.7.3.3..9.4
...1.4..2.1.`
    , "16x10":
`4.....5..5
..........
6.6..5.6.6
..........
..5.3.....
.....2.6.7
..5...3.1.
....2..1.6
5.7...6...
..........
5.4.4.7..6
..........
......3.1.
5.5.4.....
..........
3.5.5.6..3`
}
// const testPuzzle = [
// ["4.8.6"],
// ["....."],
// ["4.a.8"],
// ["....."],
// ["4.9.5"],]

import { printBridges, solve, stringToBoard, symbolsH, symbolsV, history } from './hashiSolver.js'
import { Button, Tooltip } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { MenuItem, Select, Slider, Stack } from "@mui/material";

export default function Hashi() {
    const [solution, setSolution] = React.useState(null);
    const [startPuzzle, setStartPuzzle] = React.useState(stringToBoard(startPuzzles["5x5"]));
    const [startPuzzleString, setStartPuzzleString] = React.useState(startPuzzles["5x5"]);
    const [historyState, setHistoryState] = React.useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = React.useState(0);
    useEffect(() => {
        console.log('startPuzzle', startPuzzle);
    }, [startPuzzle]);

    function bridgeTooltip(bridges: any) {
        if (bridges.length === 0) return "";
        if (bridges.length === 1) return `${bridges[0].value} `;
        if (bridges.length === 2) return `↕${bridges[0].value} ↔${bridges[1].value}`
    }

    return (
        <>
          <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-4">Hashiwokakero</h1>
                <p className="mb-4">Puzzle solver</p>
            </div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">About Hashiwokakero</h2>
                <p className="mb-4">Hashiwokakero, also known as Bridges, is a logic puzzle where the objective is to connect islands with bridges according to specific rules. </p>
                <p className="mb-4">Each island is represented by a circle with a number indicating how many bridges must connect to it. Bridges can be placed horizontally or vertically between islands, and they cannot cross each other. </p>
                <p className="mb-4">The goal is to create a network of bridges that connects all islands while adhering to the constraints provided by the numbers on each island.</p>
                {/* <p className="mb-4">This project involves creating a solver for Hashiwokakero puzzles using algorithms that can efficiently explore possible configurations and find valid solutions. The solver takes into account the constraints of the puzzle, such as the number of bridges per island and the requirement for all islands to be interconnected.</p> */}
                <p className="mb-4">The implementation employs backtracking and constraint satisfcation </p>
            </div>
            <div className="flex flex-col items-center">
            <Stack spacing={2} direction="row" className="mb-4">
            <Select
                className="mb-4 p-2 border rounded"
                defaultValue={"5x5"}
                onChange={(e) => {
                    setStartPuzzleString(startPuzzles[e.target.value]);
                    setStartPuzzle(stringToBoard(startPuzzles[e.target.value]));
                    setSolution(null);
                }}
            >
                {/* <option value="">Select a puzzle...</option> */}
                {Object.keys(startPuzzles).map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
            </Select>
            <Button onClick={() => {
                setSolution(solve(stringToBoard(startPuzzleString)));
                setHistoryState(history)
            }} > Solve </Button>
            <Button onClick={() => {
                setSolution(null);
                setStartPuzzle(stringToBoard(startPuzzleString));
                setStartPuzzleString(startPuzzleString);
            }} > Reset </Button>
            </Stack>

                {/* <div className="grid grid-cols-3 gap-4">
                    {squares}
                </div>
                <div className="mt-4">
                    <Button onClick={() => {
                        setValues(Array(81).fill(""));
                        setCurrentSubBoard(null);
                        setPlayer("X");
                        setGameOver(false);
                        setGlobalBoard(Array(10).fill().map(() => Array(10).fill(0)));
                        setCurrBoard(-1);
                        setMoveCount(0);
                    }} color="green" variant="outlined">Reset Game</Button>
                    <Button onClick={() => {
                        setCheatMode(!cheatMode);
                    }} color={cheatMode ? "red" : "blue"} variant="outlined" className="ml-4">{cheatMode ? "Disable" : "Enable"} Cheat Mode</Button>
                </div> */}
                {!solution && startPuzzle && startPuzzleString.split('\n').map((row, i) => (
                    <div key={i} className="flex">
                        {row.split('').map((cell, j) => (
                            <Tooltip key={i} content={startPuzzle.grid[i][j].island ? 'Click: +1, Right-Click: Remove island' : (startPuzzle.grid[i][j].bridges.length > 0 ? startPuzzle.grid[i][j].bridges.map(x => x.value ).join(', ') : 'Click to add island')} placement="top">
                                {startPuzzle.grid[i][j].bridges.length === 2 ? (
                                    <div className="relative h-12 w-12 flex items-center justify-center 
                                cursor-pointer border-5 rounded bg-gray-400">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span>{startPuzzle.grid[i][j].bridges[0].value === 0 ? " " : symbolsV[startPuzzle.grid[i][j].bridges[0].value]}</span>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span>{startPuzzle.grid[i][j].bridges[1].value === 0 ? " " : symbolsH[startPuzzle.grid[i][j].bridges[1].value]}</span>
                                        </div>
                                    </div>
                                ) : (
                                <div key={j}
                                onClick={() => {
                                    // on click add island or increment island value
                                    if (startPuzzle.grid[i][j].island) {
                                        // increment island value
                                        startPuzzle.grid[i][j].island.value = (startPuzzle.grid[i][j].island.value % 15) + 1;
                                        // set char
                                        startPuzzle.grid[i][j].char = (startPuzzle.grid[i][j].island.value).toString(16);
                                        console.log('incremented island at', i, j, 'to', startPuzzle.grid[i][j].island.value);
                                        console.log(printBridges(startPuzzle, true));
                                        setStartPuzzle(startPuzzle);
                                        setStartPuzzleString(printBridges(startPuzzle, true));
                                        console.log(startPuzzle);
                                    }
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    // on right click remove island
                                    if (startPuzzle.grid[i][j].island) {
                                        startPuzzle.grid[i][j].island = null;
                                        startPuzzle.grid[i][j].char = '.';
                                        console.log('removed island at', i, j);
                                        console.log(printBridges(startPuzzle, true));
                                        setStartPuzzle(startPuzzle);
                                        setStartPuzzleString(printBridges(startPuzzle, true));
                                        console.log(startPuzzle);
                                    }
                                }}
                                className={`
                                h-12 w-12 flex items-center justify-center 
                                cursor-pointer border-5 rounded
                                ${startPuzzle.grid[i][j].island 
                                    ? `bg-${['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'teal'][startPuzzle.grid[i][j].island.value % 8]}-500` 
                                    : (startPuzzle.grid[i][j].bridges.length > 0 
                                        ? `bg-gray-400` 
                                        : 'bg-white')}`}
                                >
                                    {startPuzzle.grid[i][j].island ? startPuzzle.grid[i][j].island.value : (cell === ' ' ? '.' : cell)}
                                </div>)}
                            </Tooltip>
                        ))}
                    </div>
                ))}
                {solution && printBridges(solution, true).split('\n').map((row, i) => (
                    
                    <div key={i} className="flex" style={{fontSize: '24px', lineHeight: '24px'}}>
                        {row.split('').map((cell, j) => (
                            <Tooltip key={i} content={solution.grid[i][j].island ? solution.grid[i][j].island.value : (solution.grid[i][j].bridges.length > 0 ? bridgeTooltip(solution.grid[i][j].bridges) : '')} placement="top">
                                {solution.grid[i][j].bridges.length === 2 ? (
                                    <div className="relative h-12 w-12 flex items-center justify-center bg-gray-400
                                cursor-pointer border-5 rounded">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span>{solution.grid[i][j].bridges[0].value === 0 ? " " : symbolsV[solution.grid[i][j].bridges[0].value]}</span>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span>{solution.grid[i][j].bridges[1].value === 0 ? " " : symbolsH[solution.grid[i][j].bridges[1].value]}</span>
                                        </div>
                                    </div>
                                ) : (
                                <div key={j} className={`
                                h-12 w-12 flex items-center justify-center 
                                cursor-pointer border-5 rounded
                                ${solution.grid[i][j].island 
                                    ? `bg-${['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'teal'][solution.grid[i][j].island.value % 8]}-500` 
                                    : (solution.grid[i][j].bridges.length > 0 
                                        ? `bg-gray-400` 
                                        : 'bg-white')}`}
                                >
                                    {cell}
                                </div>)}
                            </Tooltip>
                        ))}
                    </div>
                ))}
            <div className="fixed" style={{ width: '200px', top: '50%', left: "10%", transform: 'translateY(-50%)', paddingLeft: '16px' }}>
                <h2 className="text-xl font-bold mb-4">History</h2> 
                <Slider orientation="horizontal" valueLabelDisplay="auto" min={1} max={historyState.length} value={historyIndex} onChange={(e, val) => {
                    setHistoryIndex(val as number);
                }} />   
                <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                            {historyState && historyState[historyIndex] && historyState[historyIndex].split('\n').map((line, i) => (
                                <div key={i} className="flex">
                                    {line.split('').map((char, j) => (
                                        <div key={j} className={`h-12 w-12 flex items-center justify-center 
                                        cursor-pointer border-5 rounded ${char === '.' ? 'text-white' : 'text-black'}`}>
                                            {"*" === char ? " " : char}
                                        </div>
                                    ))}
                                </div>
                            ))}
                </div>
            </div>
                {/* {printBridges(solution, true).split('\n').map((line, i) => (
                    line.split('').map((char, j) => (
                        <span key={j} className={`inline-block w-6 h-6 text-center ${char === '.' ? 'text-white' : 'text-black'}`}>
                            {char}
                        </span>
                    ))
                    // <div key={i} className="font-mono">
                    //     {line}
                    // </div>
                ))} */}
            </div>
            <div className="container mx-auto p-8">
                <h2 className="text-2xl font-bold mb-4">How to Play</h2>
                <ol className="list-decimal list-inside mb-4">
                    <li>Each island must be connected to the exact number of bridges indicated by the number on it.</li>
                    <li>Bridges can only be placed horizontally or vertically between islands.</li>
                    <li>No more than two bridges can connect the same pair of islands.</li>
                    <li>Bridges cannot cross each other.</li>
                    <li>All islands must be interconnected, forming a single network.</li>
                </ol>
            </div>
            
        </>
    );
}