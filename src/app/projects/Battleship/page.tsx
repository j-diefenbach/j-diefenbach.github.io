'use client';
import { Navbar } from '@/components';
import { Height } from '@mui/icons-material';
import { Button, Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts';
import { useState } from 'react';

const Cell = styled(Paper)(({ theme }) => ({
    height: 50,
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
    },
}));

export default function BattleshipGame() {
    const boardSize = 7;
    const [board, setBoard] = useState<('ship' | null)[][]>(() => 
        Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
    );

    const ships = [
        { name: 'Patrol Boat', length: 2 },
        { name: 'Destroyer', length: 3 },
        { name: 'Submarine', length: 3 },
        { name: 'Cruiser', length: 4 },
        { name: 'Carrier', length: 5 },
    ];
    const [numPossibilities, setNumPossibilities] = useState([0]);
    const [numHits, setNumHits] = useState([0]);
    const [numMisses, setNumMisses] = useState([0]);
    const [currentShipIndex, setCurrentShipIndex] = useState(0);
    const [remainingShips, setRemainingShips] = useState([...ships]);
    const [likelihoods, setLikelihoods] = useState<number[][]>(Array(boardSize).fill(null).map(() => Array(boardSize).fill(0)));
    function getLikelihoods() {
        const likelihoods = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
        for (let ship of ships) {
            for (let r = 0; r < boardSize; r++) {
                for (let c = 0; c <= boardSize - ship.length; c++) {
                    // Horizontal placements
                    let canPlace = true;
                    for (let k = 0; k < ship.length; k++) {
                        console.log(r, c, k, hits[r][c + k], board[r][c + k])
                        if (hits[r][c + k] && (board[r][c + k] ?? "") !== 'ship') {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let k = 0; k < ship.length; k++) {
                            likelihoods[r][c + k]++;
                        }
                    }
                    
                }
            }
            for (let c = 0; c < boardSize; c++) {
                for (let r = 0; r <= boardSize - ship.length; r++) {
                    // Vertical placements
                    let canPlace = true;
                    for (let k = 0; k < ship.length; k++) {
                        if (hits[r + k][c] && (board[r + k][c] ?? "") !== 'ship') {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let k = 0; k < ship.length; k++) {
                            likelihoods[r + k][c]++;
                        }
                    }
                }
            }
        }
        setNumPossibilities([...numPossibilities, likelihoods.flat().reduce((a, b) => a + b, 0)]);
        setNumHits([...numHits, hits.flat().filter((cell, idx) => cell && board.flat()[idx] === 'ship').length]);
        setNumMisses([...numMisses, hits.flat().filter((cell, idx) => cell && board.flat()[idx] !== 'ship').length]);
        console.log(numPossibilities)
        return likelihoods;
    }

    const placeShipsRandomly = async () => {
        const newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
        let shipsPlaced = 0;

        while (shipsPlaced < ships.length) {
            const ship = ships[shipsPlaced];
            // Randomly choose orientation: 0 = horizontal, 1 = vertical
            const orientation = Math.random() < 0.5 ? 0 : 1;
            let spaceAvailable = true;

            if (orientation === 1) {
                // Vertical placement
                const shipCol = Math.floor(Math.random() * boardSize);
                const shipRow = Math.floor(Math.random() * (boardSize - ship.length));

                // Check if space is available
                for (let i = 0; i < ship.length; i++) {
                    if (newBoard[shipRow + i][shipCol] === 'ship') {
                        spaceAvailable = false;
                        break;
                    }
                }
                if (spaceAvailable) {

                for (let i = 0; i < ship.length; i++) {
                    newBoard[shipRow + i][shipCol] = 'ship';
                }
                shipsPlaced++;
                }
                setBoard(newBoard);
            } else {
                // Horizontal placement
                const shipRow = Math.floor(Math.random() * boardSize);
                const shipCol = Math.floor(Math.random() * (boardSize - ship.length));

                // Check if space is available
                for (let i = 0; i < ship.length; i++) {
                    if (newBoard[shipRow][shipCol + i] === 'ship') {
                        spaceAvailable = false;
                        break;
                    }
                }
                if (spaceAvailable) {
                for (let i = 0; i < ship.length; i++) {
                    newBoard[shipRow][shipCol + i] = 'ship';
                }
                shipsPlaced++;
                }
                setBoard(newBoard);

            }
            
        }

        setBoard(newBoard);
        setIsPlacingShips(false);
        setPlacedShips(5); // All ships placed
    };

    const [hits, setHits] = useState<boolean[][]>(
        Array(boardSize).fill(null).map(() => Array(boardSize).fill(false))
    );
    
    const [gameOver, setGameOver] = useState(false);
    const [shots, setShots] = useState(0);

    const handleClick = (row: number, col: number) => {
        if (gameOver || hits[row][col]) return;

        const newHits = [...hits.map(row => [...row])];
        newHits[row][col] = true;
        setHits(newHits);
        setShots(prev => prev + 1);

        if (board[row][col] === 'ship') {
            // Check if all ships are hit
            let allShipsHit = true;
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (board[i][j] === 'ship' && !newHits[i][j]) {
                        allShipsHit = false;
                    }
                }
            }
            if (allShipsHit) {
                setGameOver(true);
            }
        }
    };

    const resetGame = () => {
        window.location.reload();
    };

    const [isPlacingShips, setIsPlacingShips] = useState(true);
    const [shipLength, setShipLength] = useState(ships[currentShipIndex].length);
    const [placedShips, setPlacedShips] = useState<number>(0);

    const handleCellClick = (row: number, col: number) => {
        if (!isPlacingShips) {
            handleShot(row, col);
        } else {
            handleShipPlacement(row, col);
        }
    };

    // const handleShipPlacement = (row: number, col: number) => {
    //     if (!remainingShips.length) return;
    //     const currentShip = remainingShips[0];
        
    //     if (col + currentShip.length > boardSize) return; // Prevent placement outside board
        
    //     // Check if space is available
    //     for (let i = 0; i < currentShip.length; i++) {
    //         if (board[row][col + i] === 'ship') return;
    //     }

    //     const newBoard = board.map(row => [...row]);
    //     for (let i = 0; i < currentShip.length; i++) {
    //         newBoard[row][col + i] = 'ship';
    //     }
    //     setBoard(newBoard);
    //     setPlacedShips(prev => prev + 1);
    //     setRemainingShips(prev => prev.slice(1)); // Remove placed ship

    //     if (placedShips + 1 >= ships.length) {
    //         setIsPlacingShips(false);
    //     }
    // };

    const handleShot = (row: number, col: number) => {
        if (gameOver || hits[row][col]) return;
        setLikelihoods(getLikelihoods());

        const newHits = [...hits.map(row => [...row])];
        newHits[row][col] = true;
        setHits(newHits);
        setShots(prev => prev + 1);

        if (board[row][col] === 'ship') {
            let allShipsHit = true;
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (board[i][j] === 'ship' && !newHits[i][j]) {
                        allShipsHit = false;
                    }
                }
            }
            if (allShipsHit) {
                setGameOver(true);
            }
        }
        console.log(likelihoods)
    };
    const [previewCells, setPreviewCells] = useState<{ row: number; col: number }[]>([]);

    // const handleMouseEnter = (row: number, col: number) => {
    //     if (!isPlacingShips || !remainingShips.length) return;
        
    //     const currentShip = remainingShips[0];
    //     if (col + currentShip.length > boardSize) return;

    //     const preview = [];
    //     for (let i = 0; i < currentShip.length; i++) {
    //         preview.push({ row, col: col + i });
    //     }
    //     setPreviewCells(preview);
    // };

    const handleMouseLeave = () => {
        setPreviewCells([]);
    };
    
    const isPreviewCell = (row: number, col: number) => {
        return previewCells.some(cell => cell.row === row && cell.col === col);
    };
    const [isVertical, setIsVertical] = useState(false);

    const handleOrientationToggle = () => {
        setIsVertical(prev => !prev);
        setPreviewCells([]); // Clear preview when changing orientation
    };

    // Modified handleShipPlacement to support vertical placement
    const handleShipPlacement = (row: number, col: number) => {
        if (!remainingShips.length) return;
        const currentShip = remainingShips[0];
        let placementSuccessful = false;
        let attempts = 0;
        const maxAttempts = 20;

        if (isVertical) {
            if (row + currentShip.length > boardSize) return; // Prevent vertical placement outside board
            
            // Check if space is available vertically
            for (let i = 0; i < currentShip.length; i++) {
                if (board[row + i][col] === 'ship') return;
            }

            const newBoard = board.map(row => [...row]);
            for (let i = 0; i < currentShip.length; i++) {
                newBoard[row + i][col] = 'ship';
            }
            setBoard(newBoard);
        } else {
            if (col + currentShip.length > boardSize) return; // Prevent horizontal placement outside board
            
            // Check if space is available horizontally
            for (let i = 0; i < currentShip.length; i++) {
                if (board[row][col + i] === 'ship') return;
            }

            const newBoard = board.map(row => [...row]);
            for (let i = 0; i < currentShip.length; i++) {
                newBoard[row][col + i] = 'ship';
            }
            setBoard(newBoard);
        }
        placementSuccessful = true;
        setPlacedShips(prev => prev + 1);
        setRemainingShips(prev => prev.slice(1));

        if (placedShips + 1 >= ships.length) {
            setIsPlacingShips(false);
        }
    };

    // Modified handleMouseEnter to support vertical preview
    const handleMouseEnter = (row: number, col: number) => {
        if (!isPlacingShips || !remainingShips.length) return;
        
        const currentShip = remainingShips[0];
        if (isVertical) {
            if (row + currentShip.length > boardSize) return;
            
            const preview = [];
            for (let i = 0; i < currentShip.length; i++) {
                preview.push({ row: row + i, col });
            }
            setPreviewCells(preview);
        } else {
            if (col + currentShip.length > boardSize) return;
            
            const preview = [];
            for (let i = 0; i < currentShip.length; i++) {
                preview.push({ row, col: col + i });
            }
            setPreviewCells(preview);
        }
    };
    return (
        <>
        <Navbar />
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Battleship Game
            </Typography>
            {isPlacingShips ? (
                <Typography variant="h6" gutterBottom>
                    Place your ships ({placedShips}/5 placed)
                </Typography>
            ) : (
                <Typography variant="h6" gutterBottom>
                    Shots: {shots}
                </Typography>
            )}
            {isPlacingShips && (
                <>
                    <Button 
                        variant="contained" 
                        onClick={placeShipsRandomly} 
                        sx={{ mb: 2, mr: 2 }}
                    >
                        Place Ships Randomly
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleOrientationToggle}
                        sx={{ mb: 2 }}
                    >
                        <Height sx={{ 
                            transform: isVertical ? 'none' : 'rotate(90deg)',
                            transition: 'transform 0.3s'
                        }}/>
                        {isVertical ? 'Vertical' : 'Horizontal'} Placement
                    </Button>
                </>
            )}
            {!isPlacingShips && !gameOver && (
                <>
                <Typography variant="body1" gutterBottom>
                    Click on the cells to shoot!
                </Typography>
                <Button variant="contained" onClick={resetGame} sx={{ mb: 2 }}>
                    Reset Game
                </Button>
                <Button variant="contained" onClick={placeShipsRandomly} sx={{ mb: 2, ml: 2 }}>
                    Shuffle Ships
                </Button>
                </>
            )}
            <div className="grid grid-cols-7 gap-2 max-w-[400px] mx-auto my-4">
                {board.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            onMouseLeave={handleMouseLeave}
                            className={`
                                h-12 w-12 flex items-center justify-center 
                                cursor-pointer border-2 border-gray-400 rounded
                                ${!isPlacingShips && hits[rowIndex][colIndex] 
                                    ? cell === 'ship' 
                                        ? 'bg-red-500' 
                                        : 'bg-gray-300'
                                    : isPreviewCell(rowIndex, colIndex)
                                        ? 'bg-gray-500'
                                        : (
                                            isPlacingShips ? (
                                                board[rowIndex][colIndex] === 'ship' ? 'bg-gray-800' : 'bg-gray-200'
                                            ) : 
                                            (likelihoods[rowIndex][colIndex] === 0 
                                                ? 'bg-black'
                                                : likelihoods[rowIndex][colIndex] / Math.max(...likelihoods.flat()) > 0.75
                                                    ? 'bg-orange-600'
                                                    : "")
                                        )
                                }
                            `}
                            style={{
                                backgroundColor: likelihoods[rowIndex][colIndex] === 0 && !isPlacingShips
                                    ? 'black'
                                    : `rgba(255, ${255 - (likelihoods[rowIndex][colIndex] / Math.max(...likelihoods.flat()) * 255)}, 0, 1)`
                            }}
                        >
                            {!isPlacingShips && hits[rowIndex][colIndex] && (
                                <span className="absolute" style={{ fontSize: '24px' }}>
                                    {board[rowIndex][colIndex] === 'ship' ? '💥' : '💨'}
                                </span>
                            )}
                        </div>
                    ))
                ))}
            </div>
            <div className="fixed" style={{ width: '200px', top: '50%', left: "10%", transform: 'translateY(-50%)', paddingLeft: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                    <h2>Hits and Misses</h2>
                    <LineChart 
                        xAxis={[
                            {data: Array.from({length: numPossibilities.length}, (_, i) => i)},
                            {data: Array.from({length: numPossibilities.length}, (_, i) => i)}
                        ]} 
                        series={[
                            {id: 'Hits', label: 'Hits', data: numHits, area: true, color: '#ff3c00db', showMark: false,},
                            {id: 'Misses', label: 'Misses', data: numMisses, area: true, color: '#abababaa', showMark: false,}
                        ]}
                        width={400} 
                        height={300} 
                        grid={{ vertical: true, horizontal: true }}
                        hideLegend={false}
                        sx={{
                            '& .MuiAreaElement-root[data-series="Hits"]': {
                                fill: "url('#hitGradient')",
                                filter: 'none', // Remove the default filtering
                            },
                            '& .MuiAreaElement-root[data-series="Misses"]': {
                                fill: "url('#missGradient')",
                                filter: 'none', // Remove the default filtering
                            },
                        }}
                    >
                        <defs>
                            <linearGradient id="hitGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgba(255, 0, 0, 0.8)" />
                                <stop offset="95%" stopColor="rgba(255, 0, 0, 0.2)" />
                            </linearGradient>
                            <linearGradient id="missGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgba(52, 216, 221, 0.8)" />
                                <stop offset="95%" stopColor="rgba(128, 128, 128, 0.2)" />
                            </linearGradient>
                        </defs>
                    </LineChart>
                    <h2>Number of Possibilities</h2>
                    <LineChart 
                        xAxis={[
                            {data: Array.from({length: numPossibilities.length}, (_, i) => i)},
                        ]} 
                        series={[
                            {data: numPossibilities, area: true, color: '#0000ffdb', showMark: false,},
                        ]}
                        width={400} 
                        height={300} 
                        grid={{ vertical: true, horizontal: true }}
                        sx={
                            {'& .MuiAreaElement-root': {
                                fill: "url('#possibilityGradient')",
                                filter: 'none', // Remove the default filtering
                            },
                        }
                        }
                    >
                        <defs>
                            <linearGradient id="possibilityGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgba(0, 0, 255, 0.8)" />
                                <stop offset="95%" stopColor="rgba(0, 0, 255, 0.2)" />
                            </linearGradient>
                        </defs>
                    </LineChart>
                </div>
                <div className="grid grid-cols-7 gap-2 max-w-[400px] my-4">
                    {/* Move the existing grid content here */}
                </div>
            </div>
            {gameOver && (
                <div className="mt-4">
                    <Typography variant="h5" gutterBottom>
                        Game Over! You won in {shots} shots!
                    </Typography>
                    <Button variant="contained" onClick={resetGame}>
                        Play Again
                    </Button>
                </div>
            )}
        </Box>
        </>

    );
};

// export default BattleshipGame;</Cell>