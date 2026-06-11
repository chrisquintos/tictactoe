const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");

let playerTurn = true;
let computerMoveTimeout = null;
let gameOver = false;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("newGameButton").addEventListener("click", newGame);
    createBoard();
});

function createBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const btn = document.createElement("button");
        btn.classList.add("square");
        btn.id = i;
        btn.addEventListener("click", handlePlayerClick);
        gameBoard.append(btn);
    }
    playerTurn = true;
    gameOver = false;
    infoDisplay.textContent = "Your turn (X)";
}

function getSquares() {
    return document.querySelectorAll(".square");
}

function handlePlayerClick(e) {
    if (!playerTurn || gameOver) return;

    const square = e.target;
    if (square.textContent !== "") return;

    square.textContent = "X";
    square.classList.add("x");
    square.disabled = true;

    if (checkWinner("X")) {
        infoDisplay.textContent = "You win!";
        gameOver = true;
        disableBoard();
        return;
    }

    if (isBoardFull()) {
        infoDisplay.textContent = "Draw game!";
        gameOver = true;
        return;
    }

    playerTurn = false;
    infoDisplay.textContent = "Computer's turn...";
    computerMoveTimeout = setTimeout(makeComputerMove, 1000);
}

function makeComputerMove() {
    if (gameOver) return;

    const available = Array.from(getSquares()).filter(btn => btn.textContent === "");
    if (available.length === 0) return;

    const chosen = available[Math.floor(Math.random() * available.length)];
    chosen.textContent = "O";
    chosen.classList.add("o");
    chosen.disabled = true;

    if (checkWinner("O")) {
        infoDisplay.textContent = "Computer wins!";
        gameOver = true;
        disableBoard();
        return;
    }

    if (isBoardFull()) {
        infoDisplay.textContent = "Draw game!";
        gameOver = true;
        return;
    }

    playerTurn = true;
    infoDisplay.textContent = "Your turn (X)";
}

function checkWinner(mark) {
    const squares = getSquares();
    return winningCombos.some(combo =>
        combo.every(index => squares[index].textContent === mark)
    );
}

function isBoardFull() {
    return Array.from(getSquares()).every(btn => btn.textContent !== "");
}

function disableBoard() {
    getSquares().forEach(btn => btn.disabled = true);
}

function newGame() {
    clearTimeout(computerMoveTimeout);
    computerMoveTimeout = null;
    createBoard();
}