const board = document.getElementById('board');
const squares = document.getElementsByClassName('square');
const players = ['X', 'O']; // 'X' = players[0] human player, 'O' = players[1] AI player

const endMessage = document.createElement('h2');
endMessage.textContent = ``;
endMessage.style.marginTop = '30px';
endMessage.style.textAlign = 'center';
board.after(endMessage);

var statusGame = false;
var humanScore = 0;
var aiScore = 0;
var drawScore = 0;

const winComb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// function to check winner
function checkWin(currentPlayer) {
    for (let i = 0; i < winComb.length; i++) {
        const [a, b, c] = winComb[i];
        if (squares[a].textContent === currentPlayer && squares[b].textContent === currentPlayer && squares[c].textContent === currentPlayer) {
            return true;
        }
    }
    return false;
}

// function to check draw
function checkTie() {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].textContent === '') {
            return false;
        }
    }
    return true;
}

// function to restart game
function restartButton() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].textContent = "";
        squares[i].addEventListener('click', handleClick);
    }
    endMessage.textContent = ``;
    statusGame = false;
}

// function to handle the click event
function handleClick() {
    if (statusGame || this.textContent !== '') {
        return;
    }
    // human value
    this.textContent = players[0];

    if (checkWin(players[0])) {
        endMessage.textContent = `Game over! ${players[0]} wins!`;
        statusGame = true;
        humanScore++;
        updateScores();
        removeAllListeners();
        return;
    }

    if (checkTie()) {
        endMessage.textContent = `Game is tied!`;
        statusGame = true;
        drawScore++;
        updateScores();
        removeAllListeners();
        return;
    }

    // computer move using minimax
    let bestMove = minimax(true).index; // initializa minmax al
    squares[bestMove].textContent = players[1];

    if (checkWin(players[1])) {
        endMessage.textContent = `Game over! ${players[1]} wins!`;
        statusGame = true;
        aiScore++;
        updateScores();
        removeAllListeners();
        return;
    }

    if (checkTie()) {
        endMessage.textContent = `Game is tied!`;
        statusGame = true;
        drawScore++;
        updateScores();
        removeAllListeners();
        return;
    }
}

// function to remove all event listeners
function removeAllListeners() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].removeEventListener('click', handleClick);
    }
}

// function to update scores
function updateScores() {
    document.getElementById('aiScore').textContent = aiScore;
    document.getElementById('humanScore').textContent = humanScore;
    document.getElementById('drawScore').textContent = drawScore;
}

var numRec = 0;

// minimax algorithm with alpha-beta pruning
function minimax(isMaximizing, alpha = -Infinity, beta = Infinity) {
    numRec++;
    console.log(numRec);

    let availableSpots = [];
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].textContent === '') {
            availableSpots.push(i);
        }
    }

    // check game status
    if (checkWin(players[0])) { 
        return { score: -10 }; // if human player win set score with -10
    } else if (checkWin(players[1])) {
        return { score: 10 };
    } else if (availableSpots.length === 0) { // if AI player win set score with +10
        return { score: 0 };
    }

    let moves = [];

    // Generating Possible Moves
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        squares[availableSpots[i]].textContent = isMaximizing ? players[1] : players[0];

        let result;
        if (isMaximizing) {
            result = minimax(false, alpha, beta);
            move.score = result.score;
            alpha = Math.max(alpha, move.score);
        } else {
            result = minimax(true, alpha, beta);
            move.score = result.score;
            beta = Math.min(beta, move.score);
        }

        squares[availableSpots[i]].textContent = '';
        moves.push(move);

        if (beta <= alpha) {
            break; // Alpha-Beta Pruning
        }
    }
    
    // Choosing the Best Move
    let bestMove;
    if (isMaximizing) { // If isMaximizing is true (it's the computer's turn), the move with the highest score is searched.
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) { // If isMaximizing is false (it's the human's turn), the move with the lowest score is searched.
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Add event listeners to squares
for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', handleClick);
}
