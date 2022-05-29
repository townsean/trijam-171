const MAX_ROW_COUNT = 10;
const MAX_COLUMN_COUNT = 10;
const MAX_LIVES = 3;
const MAX_PROBES = 5;

const STARTING_ROW = 4;
const STARTING_COLUMN = 0;
const ENDING_ROW = 5;
const ENDING_COLUMN = 9;


let _gameState = {};
const traps = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 0, 0, 0, 0, 1, 1],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

/**
 * Generate game table
 * @param {*} rowCount 
 * @param {*} columnCount 
 */
 function generateGameTable(rowCount, columnCount) {
    const gameTable = document.getElementById('game-table');
    gameTable.innerHTML = '';

    for(let row = 0; row < rowCount; row++) {
        const tr = document.createElement('tr');
        for(let col = 0; col < columnCount; col++) {
            const td = document.createElement('td');
            td.id = `td-${row}-${col}`;

            const div = document.createElement('div');
            div.id = `${row}-${col}`;
            div.classList.add('game-cell');

            td.appendChild(div);
            tr.appendChild(td);
        }

        gameTable.appendChild(tr);
    }   
}

/**
 * Set starting and ending tiles on matrix
 */
function setGameMatrix() {
    // set starting point
    let startTd = document.getElementById(`td-${STARTING_ROW}-${STARTING_COLUMN}`);
    if(startTd) {
        startTd.classList.add('starting-tile');
    }

    // set ending point
    let endTd = document.getElementById(`td-${ENDING_ROW}-${ENDING_COLUMN}`);
    if(endTd) {
        endTd.classList.add('ending-tile');
    }
}

/**
 * Play the sound file at the specified location
 * @param {*} url 
 * @param {*} loop 
 */
 function playSound(url, volume = 1, loop = false) {
    const audio = new Audio();
    audio.src = url;
    audio.volume = volume;
    audio.loop = loop;
    audio.play();
}

/**
 * Update's the player's position 
 * @param {*} row 
 * @param {*} col 
 */
function updatePlayerPosition(row, col) {
    // clear previous player position
    let player = document.getElementById(`${_gameState.playerRow}-${_gameState.playerCol}`);
    if(player) {
        player.classList.remove('player');
    }

    // update to new player position
    _gameState.playerRow = row;
    _gameState.playerCol = col;
    player = document.getElementById(`${_gameState.playerRow}-${_gameState.playerCol}`);
    
    // check if game is over
    if(_gameState.playerRow == ENDING_ROW && _gameState.playerCol == ENDING_COLUMN) {
        _gameState.isGameOver = true;
        _gameState.hasPlayerWon = true;
        player.classList.add('player');
        playSound('assets/door.wav', .5);

        const overlay = document.getElementById('victory-table-overlay');
        overlay.classList.remove('hidden');
    } else if(_gameState.matrix[_gameState.playerRow][_gameState.playerCol]) {
        player.classList.add('player');
        playSound('assets/step.wav', .5);

        let playerTd = document.getElementById(`td-${row}-${col}`);
        playerTd.classList.add('reveal-safe-tile');
    } else {
        let playerTd = document.getElementById(`td-${row}-${col}`);
        playerTd.classList.add('reveal-tile');
        playSound('assets/scream.wav', .5);

        // Check if player is still living
        if(_gameState.lives == 0) {
            _gameState.isGameOver = true;
            _gameState.hasPlayerWon = false;

            const overlay = document.getElementById('end-game-table-overlay');
            overlay.classList.remove('hidden');
        } else {
            // Update lives label
            _gameState.lives--;
            const livesLabel = document.getElementById('lives-label');
            livesLabel.innerHTML = _gameState.lives;
        }

        // Reset player's position
        _gameState.playerRow = STARTING_ROW;
        _gameState.playerCol = STARTING_COLUMN;
        player = document.getElementById(`${_gameState.playerRow}-${_gameState.playerCol}`);        
        player.classList.add('player');
    }
}

/**
 * Start game state
 */
function startGame() {
    generateGameTable(MAX_ROW_COUNT, MAX_COLUMN_COUNT);

    // Initialize lives label
    let livesLabel = document.getElementById('lives-label');
    livesLabel.innerHTML = MAX_LIVES;

    // Initialize probs remaining label
    let probesLabel = document.getElementById('probes-label');
    probesLabel.innerHTML = MAX_PROBES;
    probesLabel.parentElement.classList.remove('visibility--hidden');

    _gameState = {
        isGameOver: false,
        hasPlayerWon: false,
        matrix: traps,
        lives: MAX_LIVES,
        probes: MAX_PROBES,
        playerRow: STARTING_ROW,
        playerCol: STARTING_COLUMN
    };

    setGameMatrix();

    // Initialize player starting position
    updatePlayerPosition(_gameState.playerRow, _gameState.playerCol);
}


/**
 * 
 * @param {*} event 
 * @returns 
 */
 function onKeydown(event) {
    switch(event.key) {
        case "ArrowDown":
        case "s":
        case "S":
            if (_gameState.playerRow + 1 < MAX_ROW_COUNT) {
                updatePlayerPosition(_gameState.playerRow + 1, _gameState.playerCol);
            } else {
                playSound('assets/bump.wav');
            }
            break;
        case "ArrowUp":
        case "w":
        case "W":
            if (_gameState.playerRow - 1 >= 0) {
                updatePlayerPosition(_gameState.playerRow - 1, _gameState.playerCol);
            } else {
                playSound('assets/bump.wav');
            }
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            if (_gameState.playerCol - 1 >= 0) {
                updatePlayerPosition(_gameState.playerRow, _gameState.playerCol - 1);
            } else {
                playSound('assets/bump.wav');
            }
            break;
        case "ArrowRight":
        case "d":
        case "D":
            if (_gameState.playerCol + 1 < MAX_COLUMN_COUNT) {
                updatePlayerPosition(_gameState.playerRow, _gameState.playerCol + 1);
            } else {
                playSound('assets/bump.wav');
            }
            break;
        default:
            return;
    }
}

/**
 * Starting function
 */
function main() {
    generateGameTable(MAX_ROW_COUNT, MAX_COLUMN_COUNT);

    const gameTable = document.getElementById('game-table');
    gameTable.addEventListener("mouseup", (event) => {

        if(_gameState.probes > 0) {
            const indexes = event.target.id.split('-');
            const row = indexes[1];
            const col = indexes[2];
            const isTrap = traps[row][col];

            // Update probes label
            _gameState.probes--;
            const probesLabel = document.getElementById('probes-label');
            probesLabel.innerHTML = _gameState.probes;
    
            if(!isTrap) {
                event.target.classList.add('reveal-tile');
                playSound('assets/break.wav', .25);
            } else {
                event.target.classList.add('reveal-safe-tile');
                playSound('assets/block.wav', .5);
            }
        }
    });

    const startButton = document.getElementById('start-button');
    startButton.addEventListener("click", () => {
        playSound('assets/loop.wav', 0.5, true);

        const overlay = document.getElementById('start-game-table-overlay');
        overlay.classList.add('hidden');

        startGame();

        document.addEventListener('keydown', onKeydown, true);
    });

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener("click", () => {
        let livesLabel = document.getElementById('lives-label');
        livesLabel.classList.remove('flashing-red');

        let probesLabel = document.getElementById('probes-label');
        probesLabel.classList.remove('flashing-red');

        const overlay = document.getElementById('end-game-table-overlay');
        overlay.classList.add('hidden');

        startGame();
    });

    const restartVictoryButton = document.getElementById('restart-victory-button');
    restartVictoryButton.addEventListener("click", () => {
        const overlay = document.getElementById('victory-table-overlay');
        overlay.classList.add('hidden');

        startGame();
    });
}

main();