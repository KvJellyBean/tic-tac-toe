// Gameboard Object
const GameBoard = (() => {
    let board = new Array(9).fill("");

    const getBoard = () => board;

    const placeXO = (player, index) => {
        board[index] = player;
    };

    // Function to reset/clear board
    const resetBoard = () => {
        board = board.fill("");
    };

    return {
        getBoard,
        placeXO,
        resetBoard
    }
})();

// Player Object
const Player = (name, mark) => {
    return {
        name,
        mark
    }
};

// Game Object
const Game = (() => {
    const players = [Player('Kevin', 'X'), Player('Natanael', 'O')];
    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const _switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    // Function to play the game each step/round
    const playRound = (index) => {
        const board = GameBoard.getBoard();
        if (index < 0 || index > 8) {
            alert("Choice box's index between 0-8")
            return;
        }

        if (board[index]) {
            console.log('Try Again, the cell already filled in');
            currentPlayer = getCurrentPlayer();
            return;
        } else {
            console.log(`${getCurrentPlayer().name} place ${getCurrentPlayer().mark} in index ${index}`);
            GameBoard.placeXO(getCurrentPlayer().mark, index);
            _switchPlayerTurn();
        }

        // Check win condition -> if win, display winner and reset game.
        if (_checkWin()) {
            // condition want to play again(maybe show dialog)? : resetgame
            resetGame();
        }
    };

    // Function to reset/restart the gmae
    const resetGame = () => {
        currentPlayer = players[0];
        GameBoard.resetBoard();
    };

    // Function to check winning/tie condition
    const _checkWin = () => {
        const board = GameBoard.getBoard();
        const winState = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        const checkWinner = (playerIndex) => {
            return winState.some(combination => combination.every(index => playerIndex.includes(index)));
        };

        const xIndex = board.reduce((acc, cell, index) => (cell === 'X' ? [...acc, index] : acc), []);
        const oIndex = board.reduce((acc, cell, index) => (cell === 'O' ? [...acc, index] : acc), []);

        if (xIndex.length >= 3 && checkWinner(xIndex)) {
            alert("Congrats, X has won!");
            return true;
        } else if (oIndex.length >= 3 && checkWinner(oIndex)) {
            alert("Congrats, O has won!");
            return true;
        } else if ((xIndex.length + oIndex.length) == 9) {
            alert('TIE');
            return true;
        }

        return false;
    };

    // const _checkWin = () => {
    //     const winState = [
    //         [0, 3, 6],
    //         [1, 4, 7],
    //         [2, 5, 8],
    //         [0, 1, 2],
    //         [3, 4, 5],
    //         [6, 7, 8],
    //         [0, 4, 8],
    //         [2, 4, 6]
    //     ]

    //     let xIndex = [];
    //     let oIndex = [];

    //     // Check indexes of all X and O
    //     for (let i = 0; i < board.length; i++) {
    //         if (board[i] == 'X') {
    //             xIndex.push(i);
    //         } else if (board[i] == 'O') {
    //             oIndex.push(i);
    //         }
    //     }

    //     console.log(`x = [${xIndex}]`);
    //     console.log(`o = [${oIndex}]`);
    //     // winner
    //     if (xIndex.length >= 2 || oIndex.length >= 2) {
    //         for (let i = 0; i < winState.length; i++) {
    //             if (xIndex.indexOf(winState[i][0]) >= 0) {
    //                 if (xIndex.indexOf(winState[i][1]) >= 0) {
    //                     if (xIndex.indexOf(winState[i][2]) >= 0) {
    //                         console.log('yes');
    //                         alert("Congrats, X have won!");
    //                         return true;
    //                     }
    //                 }
    //             }
    //             if (oIndex.indexOf(winState[i][0]) >= 0) {
    //                 if (oIndex.indexOf(winState[i][1]) >= 0) {
    //                     if (oIndex.indexOf(winState[i][2]) >= 0) {
    //                         alert("Congrats, O have won!");
    //                         return true;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return false;
    // };

    return {
        getCurrentPlayer,
        playRound,
        resetGame
    }
})();

