
"use client"
const EMPTY         = 0
const ILLEGAL_MOVE  = 0
const STILL_PLAYING = 1
const WIN           = 2
const LOSS          = 3
const DRAW          = 4

const MAX_MOVE      = 81
const MAX_DEPTH     = 10
const MIN_EVAL      = -1000000
const MAX_EVAL      = 1000000
const PLAYER_1      = 1
const PLAYER_2      = 2
const CURRENT_BOARD_MODIFIER  = 2
const NEXT_BOARD_MODIFIER     = 4
const CORNER_BONUS = 1
const CENTER_BONUS = 2

// TODO global board
const global_board = Array(10).fill().map(() => Array(10).fill(0))
// global_board = [[0 for _ in range(10)] for _ in range(10)]
let curr_board = 0 // index of current sub-board
let move_count = 0
const s = ["", "X", "O"]
const lookup = {}
const best_moves =Array(MAX_MOVE).fill().map(() => Array(10).fill(0))
// const best_moves = np.zeros((MAX_MOVE, 10),dtype=np.int32)
export { EMPTY, ILLEGAL_MOVE, STILL_PLAYING, WIN, LOSS, DRAW, MAX_MOVE, MAX_DEPTH, MIN_EVAL, MAX_EVAL, PLAYER_1, PLAYER_2, CURRENT_BOARD_MODIFIER, NEXT_BOARD_MODIFIER, CORNER_BONUS, CENTER_BONUS }
export { set_global_board, print_board, play, global_board, curr_board, move_count, best_moves, set_curr_board, set_move_count }
const win_positions = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // Horiztonal triples
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // Vertical triples
    [1, 5, 9], [3, 5, 7]             // Diagonal triples
]


const heuristic_table = [
    [0, -1, -10, -1000],
    [1, 0, 2, 0],
    [10, -2, 0, 0],
    [1000, 0, 0, 0]
]

function set_curr_board(board) {
    curr_board = board
}

function set_move_count(count) {
    move_count = count
}

function set_global_board(board) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            global_board[i][j] = board[i][j]
        }
    }
}

// ===== Main algorithm =====

function play() {
    // print_board(global_board) # Display the board move by move
    console.log(global_board)
    // # Check for and make the killing move when possible
    let killer_move = check_killer_move(PLAYER_1, global_board, curr_board)
    if (killer_move != EMPTY) {
        // TODO return place
        // place(curr_board, killer_move, PLAYER_1)
        return killer_move
    }

    // # Progressively deepen the search depth
    let depth = 0
    if (move_count <= 3) {
        depth = 5
    }
    else if (move_count < 24) {
        depth = 5
    }
    else if (move_count < 27) {
        depth = 6
    }
    else if (move_count < 39) {
        depth = 7
    }
    else if (move_count < 44) {
        depth = 9
    }
    else {
        depth = 10
    }
    // if (move_count == 3 or move_count == 4):
    //     // # Open the file in binary mode
    //     print('dumping:', lookup)
    //     with open(file_path, 'wb') as file:
    //         # Serialize and write the variable to the file
    //         pickle.dump(lookup, file)
    // # Choose the highest evaluated move, if multiple tied just pick the first
    let move_evaluations = apply_alphabeta(depth)
    console.log('move evaluations:', move_evaluations)
    let best_evaluation = Math.max(...move_evaluations)
    let chosen_move = move_evaluations.indexOf(best_evaluation)
    console.log('move evaluations:', move_evaluations, best_evaluation, chosen_move)
    // place(curr_board, chosen_move, PLAYER_1)
    return move_evaluations
}
const deepCopy = (arr) => {
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}
// # Evaluate all legal moves using alphabeta search
function apply_alphabeta(depth) {
    let move_evaluations = Array(10).fill(MIN_EVAL)
    // for (move in range(1, 10)) {
    console.log('before move', depth)
    print_board(global_board)
    for (let move = 1; move <= 9; move++) {
        if (global_board[curr_board][move] == EMPTY) {
            // let new_board = deepCopy(global_board)
            let new_board = [...global_board]
            // console.log('new board before move')
            
            // # print('applying move:', move)
            new_board[curr_board][move] = PLAYER_1
            // # result = alphabeta(new_board, curr_board, move, PLAYER_2, 1, depth, MIN_EVAL, MAX_EVAL)
            let result = -alphabeta(PLAYER_2, move_count, 1, depth, new_board, curr_board, move, MIN_EVAL, MAX_EVAL, best_moves)
            move_evaluations[move] = result
            print_board(new_board)
            console.log('move evaluation', move, result, 'depth:', depth)


            new_board[curr_board][move] = EMPTY // undo move
        }
    }
    console.log(move_evaluations)
    console.log('move', move_count, 'depth limit:', depth)
    return move_evaluations
}

function print_board(board) {
    let display = ''
    for (let big_row = 0; big_row < 3; big_row++) {
        for (let small_row = 0; small_row < 3; small_row++) {
            let row = ''
            for (let big_col = 0; big_col < 3; big_col++) {
                for (let small_col = 0; small_col < 3; small_col++) {
                    let sub_board_index = big_row * 3 + big_col + 1
                    let cell_index = small_row * 3 + small_col + 1
                    let cell_value = board[sub_board_index][cell_index]
                    row += cell_value == EMPTY ? '.' : (cell_value == PLAYER_1 ? 'X' : 'O')
                }
                row += ' '
            }
            display += row.trim() + '\n'
        }
        display += '\n'
    }
    console.log(display)
}

function alphabeta(player, m, depth, depth_limit, board, prev_sub_board, curr_sub_board, alpha, beta, best_move ) {
    let best_eval = MIN_EVAL
    let otherPlayer = 0
    if (player == 1) {
        otherPlayer = 2
    } else if (player == 2) {
        otherPlayer = 1
    }
    // # if (depth == 1):
    //     # print('evaluating move:')
    //     # print_board(board)
    //     # print('sub_board:', curr_sub_board)
    //     # print(board[curr_sub_board])
    if (board_won(player, board)) { // WIN for this player

        // # print('win for', player)
        return 1000 - depth  // better to win faster (or lose slower)
    }   
    if (board_won(otherPlayer, board)) {   // LOSS for this player
    // # print('loss for ', player)
        return -1000 + depth  // better to lose slower
    }
    if (depth >= MAX_DEPTH || depth >= depth_limit) {
        // TODO fix evaluate based on player not just globally
        if (player == 2) {
            return -evaluate(board, prev_sub_board, curr_sub_board)
        }
        else {
            return evaluate(board, prev_sub_board, curr_sub_board)
        }
    }
    let this_move = 0
    let moves = []
    // # TODO order moves by heuristic
    // # TODO mask out moves we know take the enemy to a board where they'll win
    for (const r of [best_move[m,0], best_move[m,curr_sub_board], 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        if (r in moves || r == 0) {
            continue
        }
        else {
            moves.push(r)
        }
    }
    let legalMoves = 0
    for (const this_move of moves) {
        if (board[curr_sub_board][this_move] == EMPTY) {
            legalMoves += 1
            board[curr_sub_board][this_move] = player // make move
            // check for previous evaluations
            // if (m <= 3) {
                // let key = get_dict_key(otherPlayer, board, this_move)
                // this_eval = -alphabeta(otherPlayer,m+1, depth+1, depth_limit, board, curr_sub_board, this_move, -beta,-alpha,best_move)
                // lookup[key] = {'alphabeta': this_eval}
            // } else {
            let this_eval = -alphabeta(otherPlayer,m+1, depth+1, depth_limit, board, curr_sub_board, this_move, -beta,-alpha,best_move)
            // }
            let spacing = ' '.repeat(depth*2)
            console.log(spacing, 'depth:', depth, 'move:', this_move, 'eval:', this_eval)
            board[curr_sub_board][this_move] = EMPTY  // undo move
            // # if (depth == 0):
            //     # print('move: ', s[player], this_move, 'eval:', this_eval)
            //     # print('this_eval: ', this_eval, 'best_eval:', best_eval)
            //     # print('best_moves:', best_move[m])
            if (this_eval > best_eval) {
                best_move[m,0] = this_move
                best_move[m,curr_sub_board] = this_move
                best_eval = this_eval
                if (best_eval > alpha) {
                    alpha = best_eval
                    if (alpha >= beta) {// cutoff
                        console.log(spacing, 'depth:', depth, 'move:', this_move, 'alpha:', alpha, 'beta:', beta, 'cutoff')

                        return( alpha )
                    }
                }
            }
        }
    }
    if (legalMoves == 0) {  // no legal moves
        return( 0 )     // DRAW
    } else {
        return( alpha )
    }
}
// ===== Algorithm helper functions =====

// # Check if a killing move can be made
function check_killer_move(player, bd, curr_board) {
    let board = [...bd]
    // for (move in range(1, 10)) {
    for (let move = 1; move <= 9; move++) {
        if (board[curr_board][move] == EMPTY) {
            board[curr_board][move] = player
            if (sub_board_won(player, board[curr_board])) {
                board[curr_board][move] = EMPTY
                return move
            } else {
                board[curr_board][move] = EMPTY
            }
        }
    }
        return 0
}

// # Checkif the entire game has been won
function board_won(p, board) {
    // for (a in range(1, 10)) {
    for (let a = 1; a <= 9; a++) {
        const bd = board[a]
        if (( bd[1] == p  && bd[2] == p && bd[3] == p )
           ||( bd[4] == p && bd[5] == p && bd[6] == p )
           ||( bd[7] == p && bd[8] == p && bd[9] == p )
           ||( bd[1] == p && bd[4] == p && bd[7] == p )
           ||( bd[2] == p && bd[5] == p && bd[8] == p )
           ||( bd[3] == p && bd[6] == p && bd[9] == p )
           ||( bd[1] == p && bd[5] == p && bd[9] == p )
           ||( bd[3] == p && bd[5] == p && bd[7] == p )) {
            print_board(board)
            console.log('win for player:', p)
               return true
           }
    }
    return false
}
// # Check if a particular subboard has been won
function sub_board_won(p, bd) {
    return (  
    ( bd[1] == p && bd[2] == p && bd[3] == p )
    ||( bd[4] == p && bd[5] == p && bd[6] == p )
    ||( bd[7] == p && bd[8] == p && bd[9] == p )
    ||( bd[1] == p && bd[4] == p && bd[7] == p )
    ||( bd[2] == p && bd[5] == p && bd[8] == p )
    ||( bd[3] == p && bd[6] == p && bd[9] == p )
    ||( bd[1] == p && bd[5] == p && bd[9] == p )
    ||( bd[3] == p && bd[5] == p && bd[7] == p ))
}

// # Evaluate moves using custom heuristics
function evaluate(game, board, choice, player) {
    let evaluation = 0
    // TODO FIX
    for (const [sub_board_index, sub_board] of game.entries()) {
        if (sub_board_index == 0) continue; // Skip index 0
    // for (sub_board_index, sub_board in enumerate((game[i] for i in range(1, 10)), start = 1)) {
        for (let winning_triple of win_positions) {
            const player_positions = [0, 0]
            const player_bonuses = [0, 0]
            // # TODO just return a super high/low number for a guaranteed win in the turn (ig we are doing more alphabeta atp)
            // # Add points for each move contributing to a 
            for (let move of winning_triple) {
                // console.log('sub_board_index:', sub_board_index, 'move:', move, 'value:', sub_board[move])
                if (sub_board[move] != EMPTY) {

                    const player = sub_board[move]
                    // # Give bonuses to players with center and corner positions as these are most advantageous
                    if ([1, 3, 7, 9].includes(move)) {
                        player_bonuses[player - 1] += CORNER_BONUS
                    }
                    else if (move == 5) {

                        player_bonuses[player - 1] += CENTER_BONUS
                    }
                    
                    player_positions[player - 1] += 1 // Increment the players respective number of positions in this board
                }
            }
                
            
            // # Utilize the heuristic table to evaluate the position and give bonuses to moves
            let heuristic = heuristic_table[player_positions[0]][player_positions[1]]
            if (sub_board_index == board) {// Current board evaluated is of immediate importance
                heuristic = heuristic * CURRENT_BOARD_MODIFIER             
            } else if (sub_board_index == choice)  {// Next board evaluated is of future importance too (higher priority)
                // # TODO if there is a two in a row for the current player its a win this turn
                heuristic = heuristic * NEXT_BOARD_MODIFIER
            }
            evaluation += heuristic
            evaluation += player_bonuses[0] // Reward us for having well positoned moves
            evaluation -= player_bonuses[1] // Reduce for opponent having well positioned moves
        }
    }
    return evaluation
}