// Gameboard Object
const GameBoard = (() => {
    let board = new Array(9).fill("");

    // Getter Setter
    const getBoard = () => board;

    const setBoard = (player, index) => {
        board[index] = player;
    };

    // Function to reset/clear board
    const resetBoard = () => {
        board = board.fill("");
    };

    return {
        getBoard,
        setBoard,
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
    // Variables
    let players;
    let currentPlayer;
    let round = 0;
    let gameOver = false;
    let winner;

    // Getter Setter
    const getPlayer = () => players;

    const setPlayer = (player1 = 'Player 1', player2 = 'Player 2') => {
        players = [Player(player1, 'X'), Player(player2, 'O')];
    };

    const getCurrentPlayer = () => currentPlayer;

    const setCurrentPlayer = (player) => currentPlayer = player;

    const getRound = () => round;

    const setRound = (rounds) => round = rounds;

    const getWinner = () => winner;

    const setWinner = (player) => winner = player;

    // Function to change player's turn
    const _switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    // Function to randomize who play first
    const randomFirstTurn = () => {
        let decider = Math.floor(Math.random() * 2);
        decider == 0 ? setCurrentPlayer(players[0]) : setCurrentPlayer(players[1]);
    };

    // Function to play the game each step/round
    const playRound = (index) => {
        const board = GameBoard.getBoard();

        // Check if there is already a mark inside
        if (board[index]) {
            setCurrentPlayer(currentPlayer);
            return;
        } else {
            GameBoard.setBoard(getCurrentPlayer().mark, index);
        }

        // Winning/Tie checking
        if (isWinning()) {
            gameOver = true;
            setWinner(getCurrentPlayer());
            return;
        }
        if (round === 9) {
            gameOver = true;
            return;
        }

        round++;
        _switchPlayerTurn();
    };

    // Function to reset/restart the gmae
    const resetGame = () => {
        gameOver = false;
        randomFirstTurn();
        GameBoard.resetBoard();
    };

    // Function to check winning condition
    const isWinning = () => {
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

        // Ensure the mark's indexes have a combination as winState's
        const checkWinner = (playerIndex) => {
            return winState.some(combination => combination.every(index => playerIndex.includes(index)));
        };

        const xIndex = board.reduce((acc, cell, index) => (cell === 'X' ? [...acc, index] : acc), []);
        const oIndex = board.reduce((acc, cell, index) => (cell === 'O' ? [...acc, index] : acc), []);

        if ((xIndex.length >= 3 && checkWinner(xIndex)) || oIndex.length >= 3 && checkWinner(oIndex)) {
            return true;
        }

        return false;
    };

    const gameIsOver = () => gameOver;

    return {
        setPlayer,
        getPlayer,
        setCurrentPlayer,
        getCurrentPlayer,
        setRound,
        getRound,
        setWinner,
        getWinner,
        randomFirstTurn,
        playRound,
        resetGame,
        isWinning,
        gameIsOver
    }
})();

const displayController = (() => {
    const _mainMenu = document.querySelector('#mainMenu');
    const _form = document.querySelector('form');
    const _playground = document.querySelector('#playground');
    const _board = document.querySelector('#board');
    const _enterGameBtn = document.querySelector('.startBtn');
    const _controller = document.querySelector('.controller');
    const _restartBtn = document.querySelector('.restartGame');
    const _quitGameBtn = document.querySelector('.quitGame');
    const _result = document.querySelector('.result');
    const _display = document.querySelector('.display');
    const _status = document.querySelectorAll('.status');
    const _playAgainBtn = document.querySelector('.playAgain');

    // Lobby - main menu (1st call)
    const mainMenu = () => {
        _mainMenu.style.display = 'grid';
        _form.style.display = 'none';
        _playground.style.display = 'none';
        _result.style.display = 'none';

        _controller.style.visibility = 'hidden';

        _enterGameBtn.addEventListener('click', initGame);
    }

    // Game initialize
    const initGame = () => {
        _mainMenu.style.display = 'none';
        _form.style.display = 'grid';

        const _formInput = _form.querySelectorAll('input');
        _formInput.forEach(input => input.value = "");
        _form.addEventListener('submit', _gameStart);
    };

    // Game Starting
    const _gameStart = (e) => {
        e.preventDefault();
        _form.style.display = 'none';
        _playground.style.display = 'flex';
        _controller.style.visibility = 'visible';

        const _player1 = document.querySelector('#name1').value;
        const _player2 = document.querySelector('#name2').value;
        Game.setPlayer(_player1, _player2);
        Game.randomFirstTurn();
        _renderBoard();

        _restartBtn.addEventListener('click', _restartGame);
        _quitGameBtn.addEventListener('click', _initNewGame);

        const clickEvent = Game.gameIsOver() ? 'removeEventListener' : 'addEventListener';
        _board[clickEvent]('click', _playTurn);
    }

    // Game action each turn/round
    const _playTurn = (e) => {
        if (e.target.nodeName === 'BUTTON') {
            Game.playRound(e.target.id);
            _renderBoard();

            if (Game.isWinning()) {
                _showWinner();
                _endGame();
            }
            if (Game.getRound() === 9) {
                _showTie();
                _endGame();
            }
        }
    }

    // Displaying Result
    const _showWinner = () => {
        _display.innerHTML = `<h2>${Game.getWinner().name}</h2>`;
        _status[0].innerText = 'W';
        _status[1].innerText = 'I';
        _status[2].innerText = 'N';
    }

    const _showTie = () => {
        _display.innerHTML = `<h2>DRAW</h2>`;
        _status[0].innerText = 'T';
        _status[1].innerText = 'I';
        _status[2].innerText = 'E';
    }

    // End game condition
    const _endGame = () => {
        _board.removeEventListener('click', _playTurn);
        // _board.style.display = 'grid';
        _board.style.display = 'none';
        _result.style.display = 'grid';
        // _result.style.position = 'absolute';

        _restartBtn.style.display = 'none';
        _playAgainBtn.addEventListener('click', _restartGame);
    }

    // Restart game condition
    const _restartGame = () => {
        _board.removeEventListener('click', _playTurn);
        Game.resetGame();
        Game.setRound(0);

        _board.addEventListener('click', _playTurn);
        _result.style.display = 'none';
        _board.style.display = 'grid';
        _restartBtn.style.display = 'inline-block';

        _renderBoard();
    }

    // Reinitialize game
    const _initNewGame = () => {
        _restartGame();
        mainMenu();
    }

    // Render the BoardGame
    const _renderBoard = () => {
        _board.innerHTML = '';

        const board = GameBoard.getBoard();

        board.forEach((cell, index) => {
            const button = document.createElement('button');
            button.innerText = cell;
            button.setAttribute('id', `${index}`)
            _board.appendChild(button);
        });
    };

    return {
        initGame,
        mainMenu
    }
})();

displayController.mainMenu();