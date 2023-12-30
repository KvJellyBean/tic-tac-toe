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

// ALL ABOUT DISPLAY
const displayController = (() => {
    const _mainMenu = document.querySelector('#mainMenu');
    const _enterGameBtn = document.querySelector('.startBtn');
    const _form = document.querySelector('form');
    const _playground = document.querySelector('#playground');
    const _board = document.querySelector('#board');
    const _result = document.querySelector('.result');
    const _display = document.querySelector('.display');
    const _status = document.querySelectorAll('.status');
    const _playAgainBtn = document.querySelector('.playAgain');
    const _controller = document.querySelector('.controller');
    const _restartBtn = document.querySelector('.restartGame');
    const _quitGameBtn = document.querySelector('.quitGame');
    const _redPlayer = document.querySelector('.red');
    const _bluePlayer = document.querySelector('.blue');

    // Lobby - main menu (1st call)
    const mainMenu = () => {
        // Animattion and display styling
        _mainMenu.classList.add('fadeIn-delay');
        _mainMenu.style.display = 'grid';
        _form.style.display = 'none';
        _playground.style.display = 'none';
        _result.style.display = 'none';
        _controller.style.visibility = 'hidden';
        _redPlayer.innerText = '';
        _bluePlayer.innerText = '';

        setTimeout(() => {
            document.querySelector('.sliderUp').remove();
            document.querySelector('.slider').remove();
            _redPlayer.classList.remove('slideInRed');
            _bluePlayer.classList.remove('slideInBlue');
        }, 2000);

        // Event Handler
        _enterGameBtn.addEventListener('click', initGame);
    }

    // Game initialize
    const initGame = () => {
        // Animattion and display styling
        _mainMenu.style.display = 'none';
        _playground.style.display = 'none';
        _result.style.display = 'none';
        _form.style.display = 'grid';
        _form.classList.add('fadeInLong');

        setTimeout(() => {
            _redPlayer.classList.remove('slideInRed');
            _bluePlayer.classList.remove('slideInBlue');
        }, 100);

        // Reset form input
        const _formInput = _form.querySelectorAll('input');
        _formInput.forEach(input => input.value = "");

        // Event Handler
        _form.addEventListener('submit', _gameStart);
    };

    // Game Starting
    const _gameStart = (e) => {
        e.preventDefault();

        // Animattion and display styling
        _form.style.display = 'none';
        _form.removeAttribute('class');
        _playground.style.display = 'flex';
        _controller.style.visibility = 'visible';
        _playground.classList.add('fadeIn-delay');
        _controller.classList.add('fadeIn-delay');
        _restartBtn.classList.remove('fast-reset');

        const slider = document.createElement('div');
        slider.classList.add('slider');
        slider.innerText = 'FIGHT';
        document.querySelector('main').append(slider);

        // Game setup
        let _player1 = document.querySelector('#name1').value.toUpperCase();
        let _player2 = document.querySelector('#name2').value.toUpperCase();
        _player2 = _player2 == '' ? 'BOT' : _player2;
        if (_player1 === _player2) {
            _player1 += _player1 == 'BOT' ? ' - YOU' : ' - P1'
            _player2 += _player2 == 'BOT' ? '' : ' - P2';
        }

        _redPlayer.innerText = _player1 + ' (X)';
        _player1 = _player1 == 'BOT - YOU' ? 'YOU' : _player1;
        _bluePlayer.innerText = _player2 + ' (O)';
        _redPlayer.classList.add('slideInRed');
        _bluePlayer.classList.add('slideInBlue');
        Game.setPlayer(_player1, _player2);
        Game.randomFirstTurn();
        _renderBoard();

        // Event Handler
        _restartBtn.addEventListener('click', _restartGame);
        _quitGameBtn.addEventListener('click', _initNewGame);
        const clickEvent = Game.gameIsOver() ? 'removeEventListener' : 'addEventListener';
        _board[clickEvent]('click', _playTurn);

        setTimeout(() => {
            _playground.classList.remove('fadeIn-delay');
            _controller.classList.remove('fadeIn-delay');
            document.querySelector('.slider').remove();
        }, 2000);
    }

    // Game action each turn/round
    const _playTurn = (e) => {
        if (e.target.nodeName === 'BUTTON') {
            Game.playRound(e.target.id);
            _renderBoard();

            setTimeout(() => {
                if (Game.isWinning()) {
                    _showWinner();
                    _restartBtn.classList.add('fast-reset');
                    _endGame();
                }
                if (Game.getRound() === 9) {
                    _showTie();
                    _endGame();
                }
            }, 2000);
        }
    }

    // Displaying Result
    const _showWinner = () => {
        _display.innerHTML = `<h2>${Game.getWinner().name}</h2>`;
        _status[0].innerText = 'W';
        _status[1].innerText = 'I';
        _status[2].innerText = 'N';

        // Change background based on which side is winning
        _redPlayer.classList.add(Game.getWinner().mark == 'X' ? 'redWin' : 'redLose');
        _bluePlayer.classList.add(Game.getWinner().mark == 'X' ? 'blueLose' : 'blueWin');
    }

    const _showTie = () => {
        _display.innerHTML = `<h2>DRAW</h2>`;
        _status[0].innerText = 'T';
        _status[1].innerText = 'I';
        _status[2].innerText = 'E';
    }

    // End game condition
    const _endGame = () => {
        // Animattion and display styling
        _board.style.display = 'none';
        _result.style.display = 'grid';
        _restartBtn.style.display = 'none';
        _playground.classList.add('fadeIn-delay');
        _controller.classList.add('fadeIn-delay');
        _redPlayer.innerText = '';
        _bluePlayer.innerText = '';

        setTimeout(() => {
            _playground.classList.remove('fadeIn-delay');
            _controller.classList.remove('fadeIn-delay');
        }, 2000);

        // Event Handler
        _board.removeEventListener('click', _playTurn);
        _playAgainBtn.addEventListener('click', _playAgain);
    }

    // Restart game condition
    const _restartGame = () => {
        // Animation and display styling
        _result.style.display = 'none';
        _board.style.display = 'grid';
        _restartBtn.style.display = 'inline-block';
        _playground.classList.add('fadeInOut');
        _controller.classList.add('fadeInOut');

        if (!((_redPlayer.classList.contains('redWin') && _bluePlayer.classList.contains('blueLose')) || (_redPlayer.classList.contains('redLose') && _bluePlayer.classList.contains('blueWin')))) {
            const slider = document.createElement('div');
            slider.classList.add('slider');
            document.querySelector('main').append(slider);
        }

        if (_restartBtn.classList.contains('fast-reset')) {
            setTimeout(() => {
                _playground.classList.remove('fadeInOut');
                _controller.classList.remove('fadeInOut');
                document.querySelector('.slider').remove();
            }, 100);
        } else {
            setTimeout(() => {
                _playground.classList.remove('fadeInOut');
                _controller.classList.remove('fadeInOut');
                document.querySelector('.slider').remove();
            }, 2000);
        }

        // Re-set up game
        _board.removeEventListener('click', _playTurn);
        Game.resetGame();
        Game.setRound(0);
        _board.addEventListener('click', _playTurn);

        _renderBoard();
    }

    // Play another game function
    const _playAgain = () => {
        _controller.style.visibility = 'hidden';
        _restartGame();
        _resetBackground();
        initGame();
    }

    // Reinitialize game
    const _initNewGame = () => {
        _restartGame();
        mainMenu();
        _resetBackground();
    }

    // Render the BoardGame
    const _renderBoard = () => {
        _board.innerHTML = '';

        const board = GameBoard.getBoard();

        board.forEach((cell, index) => {
            const button = document.createElement('button');
            button.innerText = cell;
            button.setAttribute('id', `${index}`)
            button.style.backgroundColor = cell == 'X' ? 'red' : cell == 'O' ? 'blue' : 'antiquewhite';
            _board.appendChild(button);
        });
    };

    // Re-set up background
    const _resetBackground = () => {
        if ((_redPlayer.classList.contains('redWin') && _bluePlayer.classList.contains('blueLose')) || (_redPlayer.classList.contains('redLose') && _bluePlayer.classList.contains('blueWin'))) {
            _redPlayer.classList.add(Game.getWinner().mark == 'X' ? 'resetRedWin' : 'resetRedLose');
            _bluePlayer.classList.add(Game.getWinner().mark == 'X' ? 'resetBlueLose' : 'resetBlueWin');
        }

        setTimeout(() => {
            _redPlayer.classList.remove('redWin', 'redLose');
            _bluePlayer.classList.remove('blueLose', 'blueWin');
            _redPlayer.classList.remove('resetRedWin', 'resetRedLose');
            _bluePlayer.classList.remove('resetBlueLose', 'resetBlueWin');
        }, 1000);
    }

    return {
        initGame,
        mainMenu
    }
})();

displayController.mainMenu();