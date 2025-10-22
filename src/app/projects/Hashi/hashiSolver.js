import { print_board } from "../TicTacToe/agent"

const directions = [{row: -1, col: 0}, 
                    {row: 0, col: 1},
                    {row: 1, col: 0},
                    {row: 0, col: -1}]
// # colour coding bridges for debugging
// const colours = ["\033[30m",
//            "\033[94m",
//            "\033[32m",
//            "\033[93m"]
const symbolsH = ["*", "─", "═", "≡"]
const symbolsV = ["*", "|", "‖", "⦀"]
const dirdic = ['up', 'right', 'down', 'left']
const history = []
const legalValueLookup = [
    [ [0], [0], [0], [0]],
    [ [1], [0,1], [0,1], [0,1] ],
    [ [2], [0,1,2], [0,1,2], [0,1,2]],
    [ [3], [0,1,2,3], [0,1,2,3], [0,1,2,3]],
    [ [], [0,1,2,3], [0,1,2,3], [0,1,2,3]],
    [ [], [2,3], [0,1,2,3], [0,1,2,3]],
    [ [], [3], [0,1,2,3], [0,1,2,3]],
    [ [], [], [1,2,3], [0,1,2,3]],
    [ [], [], [2,3], [0,1,2,3]],
    [ [], [], [3], [0,1,2,3]],
    [ [], [], [], [1,2,3]],
    [ [], [], [], [2,3]],
    [ [], [], [], [3]],
]
function printGrid(board) {
    for (let row = 0; row < board.height; row++) {
        let line = '';
        for (let col = 0; col < board.width; col++) {
            if (board.grid[row][col].island) {
                line += board.grid[row][col].island.value;
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}

function printBridges(board, toString=false) {
    let output = '';
    for (let row = 0; row < board.height; row++) {
        let line = '';
        for (let col = 0; col < board.width; col++) {
            const bridges = board.grid[row][col].bridges;
            if (bridges && bridges.length > 0) {
                if (bridges.length === 2) {
                    if (bridges[0].value === 0 && bridges[1].value === 0) {
                        line += '.';
                        continue;
                    }
                    if (bridges[0].set === false && bridges[1].set === false) {
                        line += ' ';
                        continue;
                    }
                } else if (bridges.length === 1) {
                    if (bridges[0].isHorizontal) {
                        line += bridges[0].set ? symbolsH[bridges[0].value] : ' ';
                        continue;
                    } else {
                        line += bridges[0].set ? symbolsV[bridges[0].value] : ' ';
                        continue;
                    }
                }
                let printed = false;
                for (const bridge of bridges) {
                    if (bridge.set && bridge.value !== 0) {
                        if (bridge.isHorizontal) {
                            line += symbolsH[bridge.value];
                            printed = true;
                            break;
                        } else {
                            line += symbolsV[bridge.value];
                            printed = true;
                            break;
                        }
                    } else if (bridge.set && bridge.value === 0) {
                        line += '.';
                        printed = true;
                        break;
                    }
                }
                if (!printed) {
                    line += ' ';
                }
            } else if (board.grid[row][col].island) {
                line += board.grid[row][col].char;
            } else {
                line += ' ';
            }
        }
        if (toString) {
            output += line + '\n';
        } else {
            console.log(line);
        }
    }
    return output;
}

function tryCreateBridge(board, island, dirx) {
    // search tiles in direction from island
    // if the edge is found, return false
    // create the bridge object on the way
    // add existing bridge objects to the conflicts list
    // if successful, add the bridge object to the board and its destination islands

    let curr = { row: island.row, col: island.col };
    let newBridge = genBridge(island);
    if (dirx % 2 === 1) {
        newBridge.isHorizontal = true;
    }
    let dir = directions[dirx];
    let suitableDestination = false;
    console.log('trying to create bridge from', island.row, island.col, 'going', dirdic[dirx]);
    while (!suitableDestination) {
        curr.row += dir.row;
        curr.col += dir.col;
        let newRow = curr.row;
        let newCol = curr.col;

        if (outOfBounds(board, newRow, newCol)) {
            console.log('out of bounds at', newRow, newCol);
            return false;
        } else if (board.grid[newRow][newCol].island) {
            // found a suitable bridge destination
            newBridge.destinations.push({ row: newRow, col: newCol });
            suitableDestination = true;
            // set the bridge to the island
            console.log('created bridge to', newRow, newCol);
            board.grid[newRow][newCol].island.bridges[(dirx + 2) % 4] = newBridge;
        } else {
            console.log('created bridge to', newRow, newCol);
            newBridge.tiles.push({ row: newRow, col: newCol });
        }
    }

    if (suitableDestination) {
        for (const tile of newBridge.tiles) {
            if (board.grid[tile.row][tile.col].bridges === false) {
                board.grid[tile.row][tile.col].bridges = [];
            }
            board.grid[tile.row][tile.col].bridges.push(newBridge);
        }
        board.bridges.push(newBridge);
        return newBridge;
    } else {
        return false;
    }
}

function genBridge(island) {
    const newBridge = {
        destinations: [{ row: island.row, col: island.col }],
        tiles: [],
        value: 0,
        isHorizontal: false,
        legalValues: [],
        set: false,
        conflicts: []
    };
    return newBridge;
}

function genIsland(row, col, value) {
    const newIsland = {
        row: row,
        col: col,
        value: value,
        bridges: [false, false, false, false]
    };
    return newIsland;
}

function generateBridges(board, island) {
    for (let dir = 0; dir < directions.length; dir++) {
        if (island.bridges[dir]) {
            continue;
        } else {
            island.bridges[dir] = tryCreateBridge(board, island, dir);
        }
    }
}

function outOfBounds(board, row, col) {
    if (row >= board.height) {
        return true;
    } else if (row < 0) {
        return true;
    } else if (col >= board.width) {
        return true;
    } else if (col < 0) {
        return true;
    } else {
        return false;
    }
}

function legalIsland(island) {
    let sum = 0;
    if (island.row === undefined) {
        return true;
    }
    console.log('checking island', island, island.row, island.col, 'value', island.value);
    for (const bridge of island.bridges) {
        sum += bridge.value;
    }
    if (sum > island.value) {
        return false;
    } else if (sum === island.value) {
        // solvedIslands += 1;
        return true;
    } else {
        return false;
    }
}

function compareBridges(bridge1, bridge2) {
    if (bridge1.destinations === bridge2.destinations) {
        return true;
    }
    return false;
}


function getIslandValue(island) {
    let islandValue = 0
    // # print(island.bridges)
    for (let bridge of island.bridges) {
        islandValue += bridge.value
    }
    return islandValue
}
function getConflictingBridge(board, bridge, tile) {
    if (board.grid[tile.row][tile.col].bridges.length == 1) {
        return false
    }
    else if (compareBridges(bridge,
                         board.grid[tile.row][tile.col].bridges[0]) == false) {

        return board.grid[tile.row][tile.col].bridges[0]
    }
    else {
        return board.grid[tile.row][tile.col].bridges[1]
    }
}

function allBridgesSet(board) {
    for (let bridge of board.bridges) {
        if( bridge.set == false) {
            return false
        }
        return true
    }
}

function resetAllValues(board) {
    for (let bridge of board.bridges) {
        bridge.set = false
        bridge.value = 0
    }
}

// main solution

function testBoard(board) {
    let solved = true
    for (let island in board.islands) {
        if (legalIsland(island) == false) {
            solved = false
        }
    }
    for (let row = 0; row < board.height; row++) { // TODO fix range
        for (let col = 0; col < board.width; col++) {
            if (board.grid[row][col].bridges != false) {
                if (board.grid[row][col].bridges.length == 2) {

                    if ((board.grid[row][col].bridges[0].value > 0) && 
                    (board.grid[row][col].bridges[1].value > 0)) {

                        return false
                    }
                    if(board.grid[row][col].bridges[0].set == false || 
                        board.grid[row][col].bridges[1].set == false) {
                            // raise Exception('bridge not set at', row, col)
                            return false

                        }
                }
                else if(board.grid[row][col].bridges[0].set == false) {
                    console.log('board not set')
                    return false
                }
            }
        }
    }
    return solved
}

function calcLegalValues(board, bridge) {

    // # TODO change value order
    // # valuesToTry = [3,2,0,1]
    let valuesToTry = [0,1,2,3]
    for (let conflictBridge of bridge.conflicts) {

        if ((conflictBridge.value != 0))
        valuesToTry = [0]
    }
    
    for (let dest of bridge.destinations) {
        let values = getIslandValueForLookup(board.grid[dest.row][dest.col].island)
        for (let value of valuesToTry) {
            if (values.includes(value)) {
                continue;
            } else {
                valuesToTry = valuesToTry.filter(v => v !== value);
            }
        }
        
    }
    return valuesToTry 
}

function allIslandsAreConsistent(board) {
    for (const island of board.islands) {
        if (!islandIsConsistent(board, island)) {
            return false;
        }
    }
    return true;
}

function quickConsistency(board, bridge) {
    console.log('quick consistency check at', bridge.tiles[0])
    for (const dest of bridge.destinations) {
        console.log(dest, board.grid[dest.row][dest.col].island)
        if (!islandIsConsistent(board, board.grid[dest.row][dest.col].island)) {
            // console.log('island', dest, 'is inconsistent');
            return false;
        }
    }
    // for (const neighbour of getNeighbours(board, bridge)) {
    //     const legalValues = calcLegalValues(board, neighbour);
    //     // console.log(legalValues);
    //     if (legalValues.length === 0) {
    //         return false;
    //     }
    // }
    // return true;
    // for (const br of board.bridges) {
    //     if (!arcIsConsistent(board, br, 2, 0)) {
    //         return false;
    //     }
    // }
    return true;
}

function getIslandValueForLookup(island) {
    let numBridgesRemaining = 0;
    let value = island.value;
    for (const bridge of island.bridges) {
        if (!bridge.set) {
            numBridgesRemaining += 1;
        } else {
            value -= bridge.value;
        }
    }
    const legalValues = legalValueLookup[value][numBridgesRemaining - 1];
    return legalValues;
}

function arcIsConsistent(board, bridge, maxDepth, currentDepth) {
    // returns false if a bridge has no legal values
    // check conflicting bridge(s), if set to 0, has legal values at neighbouring islands
    console.log('checking arc consistency at', bridge.tiles[0], 'depth', currentDepth);
    printBridges(board)
    for (const dest of bridge.destinations) {
        if (!islandIsConsistent(board, board.grid[dest.row][dest.col].island)) {
            console.log('island', dest, 'is inconsistent');
            return false;
        }
    }
    if (currentDepth >= maxDepth) {
        if (calcLegalValues(board, bridge).length > 0) {
            return true;
        } else {
            return false;
        }
    }
    // TODO implement removing inconsistent arc values
    const neighbours = getNeighbours(board, bridge);
    for (const neighbour of neighbours) {
        const legalValues = calcLegalValues(board, neighbour);
        // console.log(legalValues);
        if (legalValues.length === 0) {
            console.log('neighbour has no legal values1', neighbour);
            return false;
        } else if (!neighbour.set && legalValues.length === 1) {
            console.log('neighbour has only one legal value', neighbour);
            neighbour.legalValues = [];
            for (const val of legalValues) {
                neighbour.value = val;
                neighbour.set = true;

                // if (arcIsConsistent(board, neighbour, maxDepth, currentDepth)) {
                    neighbour.legalValues.push(val);
                // }
                // else continue
            }
            neighbour.value = 0;
            neighbour.set = false;
            if (neighbour.legalValues.length === 0) {
                return false;
            }
        } else if (!neighbour.set) {
            console.log('neighbour not set', neighbour);

            neighbour.legalValues = [];
            for (const val of legalValues) {
                neighbour.value = val;
                neighbour.set = true;

                // if (arcIsConsistent(board, neighbour, maxDepth, currentDepth + 1)) {
                    neighbour.legalValues.push(val);
                //     console.log('added neighbour legal value', val, neighbour);
                // }
                // else continue
            }
            console.log(neighbour.legalValues);
            neighbour.value = 0;
            neighbour.set = false;
            if (neighbour.legalValues.length === 0) {
                console.log('neighbour has no legal values', neighbour);
                return false;
            }
        }
    }
    return true;
}

function getNeighbours(board, bridge) {
    const neighbours = [];
    for (const otherBridge of bridge.conflicts) {
        if (!otherBridge.set) {
            neighbours.push(otherBridge);
        }
    }
    for (const dest of bridge.destinations) {
        const island = board.grid[dest.row][dest.col].island;
        for (const otherBridge of island.bridges) {
            if (!compareBridges(bridge, otherBridge) && !otherBridge.set) {
                neighbours.push(otherBridge);
            }
        }
    }
    return neighbours;
}


function islandIsConsistent(board, island) {
    console.log('island consistency', island.row, island.col)
    let numBridgesRemaining = 0
    let allBridgesSet = true
    let sumValue = 0
    for (let bridge of island.bridges) {
        console.log('checking bridge', bridge.tiles[0], bridge.set)
        if (bridge.set == false) {
            numBridgesRemaining += 1
            allBridgesSet = false
        } else {
            sumValue += bridge.value
        }
    }
    if (allBridgesSet) {
        if (sumValue == island.value) {
            return true
        } else {
            console.log('island inconsistent, all bridges set but sum', sumValue, '!=', island.value)
            return false
        }
    } else if (numBridgesRemaining == 1) {
        for (let bridge of island.bridges) {
            if (bridge.set === false) {
                for (let val of calcLegalValues(board, bridge)) {
                    console.log('trying value', val, 'at', bridge.tiles[0])
                    if (sumValue + val == island.value) {
                        console.log('setting last bridge to', val, 'at', bridge.tiles[0])
                        bridge.legalValues = [val]
                        return true
                    }
                }
                console.log('no legal values for last bridge at', bridge.tiles[0])
                return false
            }
        }
    } else {
        console.log('island consistent, not all bridges set')

        return true
    }
}

function getProportionOfUnsetNeighbours(board, bridge) {
    let neighbours = getNeighbours(board, bridge)
    let numNotSet = 0
    let numNeighbours = neighbours.length
    if (numNeighbours == 0) {
        return 1
    }
    for (let neighbour of neighbours) {
        if (neighbour.set == false) {

            numNotSet += 1
        }
    }
    return numNotSet / numNeighbours
}

function getNumSetNeighbours(board, bridge) {
    let neighbours = getNeighbours(board, bridge)
    let numSet = 0
    for (let neighbour of neighbours) {
        if (neighbour.set == true) {
            numSet += 1
        }
    }
    return numSet

}


function getNumNeighbourLegalValues(board, bridge) {
    let neighbours = getNeighbours(board, bridge)
    let numLegalValues = 0
    for (let neighbour of neighbours) {
        if (calcLegalValues(board, neighbour).length == 0) {
            return 0
        } else {
            numLegalValues += calcLegalValues(board, neighbour).length
        }
    }
    return numLegalValues
}

function getChangeInNeighbourLegalValues(board, bridge, value) {
    
    let currentValues = getNumNeighbourLegalValues(board, bridge)
    let prevValue = bridge.value
    bridge.value = value
    bridge.set = true
    let newValues = getNumNeighbourLegalValues(board, bridge)
    bridge.value = prevValue
    bridge.set = false
    if ((currentValues == 0) | (newValues == 0)) {
        return -1
    } else {
        return currentValues - newValues
    }
}


function pickOptimalNextBridge(board, bridges) {

    // global triedValues
    // let seenValues = []
    // seenValues.append(triedValues)
    // seenValues.append(localTriedValues)
    let bestPick = false
    console.log('finding optimal bridge', bestPick, bridges)
    for (let newBridge of bridges) {
        // # print(minLegalValues)
        if (newBridge.set == false) {
            let legalValues = calcLegalValues(board, newBridge)
            // # if (len(legalValues) == 1):
            // #     bestPick = attrdict(values = legalValues, bridge = newBridge, neighbours = newNeighbours)
            // #     break
            // # for val in legalValues:
            //     # TODO FIX
            //     # if (seenValues.index(attrdict(bridge = newBridge, value = val))):
            //         # print(seenValues.index(attrdict(bridge = newBridge, value = val)))
            //         # legalValues.remove(val)
            // # newNeighbours = getProportionOfUnsetNeighbours(board, newBridge)
            let newNeighbours = getNumSetNeighbours(board, newBridge)
            // # legalValues = newBridge.legalValues
            if (bestPick) {
                if ((legalValues.length > 0) && (legalValues.length < bestPick.values.length)) {

                    bestPick = {
                        values: legalValues,
                        bridge: newBridge,
                        neighbours: newNeighbours
                    };
                } else if ((legalValues.length > 0) && (legalValues.length === bestPick.values.length)) {
                    // if (newNeighbours <= bestPick.neighbours) {
                    bestPick = {
                        values: legalValues,
                        bridge: newBridge,
                        neighbours: newNeighbours
                    };
                }
            } else if (legalValues.length > 0) {
                bestPick = {
                    values: legalValues,
                    bridge: newBridge,
                    neighbours: newNeighbours
                };
            }
            // # elif(len(legalValues) == 0):
                // # illegalBridge = true
    // # TODO sort values by greatest reduction in neighbours legal values
    // # remove values we've already seen
    // # values = calcLegalValues(board, newBridge)
    // # while(len(values) > 0):
    // #     bestVal = false
    // #     for val in values:
    // #         if (seenValues.find(attrdict(bridge = newBridge, value = val))):
    // #             values.remove(val)
    // #             break
    // #         else:
        }
    }
    console.log(bestPick)
    return bestPick
}

// const totalBridgeChecks
// const totalStates
// const solvedIslands
// const arcPruned

function tryValues(board, bridge, value, triedValues) {
    // # if (value != 0):
    //     # print('trying value', value, 'at', bridge.tiles[0])
    // global totalBridgeChecks
    // global totalStates
    // global solvedIslands
    // global arcPruned
    // console.log(board)
    // # double check legal values
    bridge.value = value
    bridge.set = true
    history.push(printBridges(board, true))
    // # print(bridge.value, bridge.tiles[0])
    // # printDebugBridges(board)
    if (quickConsistency(board, bridge) == false) {
    // THIS ALWAYS RETURNS FALSE
    // if (arcIsConsistent(board, bridge, 1, 0) == false) {
        // # print('inconsistent arc')

        console.log('inconsistent arc')
        // arcPruned += 1
        bridge.set = false
        bridge.value = 0
        return
    }
    // totalBridgeChecks += 1
    let minLegalValues = false
    // NEVER GETS HERE
    minLegalValues = pickOptimalNextBridge(board, board.bridges)
    let illegalBridge = false
    
    if (illegalBridge) {

        // totalBridgeChecks += 1
        console.log('illegal bridge, stopping search')
    } else if (minLegalValues != false) {
        console.log('next bridge', minLegalValues.bridge.tiles[0])
        // console.log(legalValues)
        printBridges(board)

        // # print(minLegalValues.values, minLegalValues.bridge.tiles[0])
        for (let i = minLegalValues.values.length - 1; i >= 0; i--) {
            let val = minLegalValues.values[i];
            tryValues(board, minLegalValues.bridge, val, null);
        }
    }
        
    // # otherwise no legal values of bridges found
    if (allBridgesSet(board)) {

        // solvedIslands = 0
        if (testBoard(board)) {
            console.log('solved!')
            printBridges(board)
            return board
        }
        // solvedIslands = 0
    }
    
    bridge.set = false
    bridge.value = 0
    return false
}

function stringToBoard(string) {
    let board = {"grid": [], "width": 0, "height": 0, "islands": [], "bridges": []}
    let row = 0
    let col = 0
    // # print('gridWidth:', gridWidth, 'gridHeight:', gridHeight)

    // # parse islands
    // for line in fileinput.input():
    //     col = 0
    //     board.grid.append([])
    //     line = line.strip()
    //     board.width = len(line)
    //     for char in line:
    //         board.grid[row].append(attrdict(char = char, island = false, bridges = false))
    //         if (char != '.'):
    //             newIsland = genIsland(row, col, int(char, 16))
    //             board.grid[row][col].island = newIsland
    //             board.islands.append(newIsland)
    //         col += 1
            
    //     row += 1
    const lines = string.split('\n');
    // const twoDArray = lines.map(line => line.split(''));
    // console.log(twoDArray)
    for (let line of lines) {
        col = 0
        board.grid.push([])
        board.width = line.length
        console.log('line', line, 'width', board.width)
        for (let char of line) {
            board.grid[row].push({
                char: char,
                island: false,
                bridges: false
            })
            if (char != '.') {
                let newIsland = genIsland(row, col, Number("0x"+char))
                board.grid[row][col].island = newIsland
                board.islands.push(newIsland)
            }
            col += 1
        }
        row += 1
        board.height = row
    }
    board.height = row
    // # print("Islands\n", board.islands)
    // # printGrid(board)
    console.log(board)
    return board
}

function solve(board) {
    history.slice(0,1)
    // Generate bridges for each island
    for (const island of board.islands) {
        generateBridges(board, island);
        island.bridges = island.bridges.filter(value => value !== false);
        console.log(island.bridges)
    }
    // Set up bridge conflicts
    for (const bridge of board.bridges) {
        for (const tile of bridge.tiles) {
            const otherBridge = getConflictingBridge(board, bridge, tile);
            if (otherBridge !== false) {
                bridge.conflicts.push(otherBridge);
            }
        }
    }
    console.log(board);
    printBridges(board);
    // for (const bridge of board.bridges) {

    // Create a list of possible values for each bridge to start from
    const startingValues = [];
    for (const bridge of board.bridges) {
        const legalValues = calcLegalValues(board, bridge);
        for (const value of legalValues) {
            startingValues.push({
                bridge: bridge,
                v: value,
                neighbours: getNeighbours(board, bridge),
                numValues: legalValues.length,
                changeInNeighbours: getChangeInNeighbourLegalValues(board, bridge, value)
            });
        }
    }
    console.log('starting values', startingValues);
    let totalStates = 0;
    let totalBridgeChecks = 0;
    let solvedIslands = 0;
    let arcPruned = 0;

    // TODO: If a value is searched and finds no solution, remove it from legal values
    // Can do this by removing from startingValues, and later checking the bridge against startingValues
    const triedValues = [];
    while (startingValues.length > 0) {
        let bestChoice = false;
        // Prioritise choosing a bridge by picking the one with the least possible values
        // Tiebreaker by number of neighbours (maximising)
        // Tiebreak further by reduction in neighbours legal values (maximising)
        for (const startValue of startingValues) {
            if (bestChoice) {
                if (startValue.numValues < bestChoice.numValues) {
                    bestChoice = startValue;
                } else if (startValue.numValues === bestChoice.numValues) {
                    // Uncomment below for further tiebreaking if needed
                    // if (startValue.neighbours.length < bestChoice.neighbours.length) {
                    //     bestChoice = startValue;
                    // } else if (startValue.neighbours.length === bestChoice.neighbours.length) {
                    //     if (startValue.changeInNeighbours > bestChoice.changeInNeighbours) {
                    //         bestChoice = startValue;
                    //     }
                    // }
                    bestChoice = startValue;
                }
            } else {
                bestChoice = startValue;
            }
        }
        if (bestChoice !== undefined) {
            const current = [];
            let ret = tryValues(board, bestChoice.bridge, bestChoice.v, []);
            if (ret !== undefined && ret !== false) {
                return ret;
            }
            // If tryValues returns false, it means no solution was found with that value
            // So we remove it from the list of possible starting values and reset the board
            console.log('no solution found with bridge at', bestChoice.bridge.tiles[0], 'value', bestChoice.v);
            // triedValues.push({ bridge: bestChoice.bridge, value: bestChoice.v });
            startingValues.splice(startingValues.indexOf(bestChoice), 1);
            resetAllValues(board);
        } else {
            break;
        }
    }
}

export { solve, stringToBoard, printBridges, symbolsH, symbolsV, history }