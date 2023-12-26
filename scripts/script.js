// Gameboard Object
const GameBoard = (() => {
    const board = new Array(9).fill("");

    const getBoard = () => board;

    const placeXO = (player, index) => {
        board[index] = player;
    }

    return {
        getBoard,
        placeXO
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
    let gameOver = false;

    const getCurrentPlayer = () => currentPlayer;

    const _switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (index) => {
        if (GameBoard.getBoard()[index]) {
            console.log('Try Again, the cell already filled in');
            currentPlayer = getCurrentPlayer();
            return;
        } else {
            console.log(`${getCurrentPlayer().name} place ${getCurrentPlayer().mark} in index ${index}`);
            GameBoard.placeXO(getCurrentPlayer().mark, index);
            _switchPlayerTurn();
        }
    };

    return {
        getCurrentPlayer,
        playRound
    }
})();

