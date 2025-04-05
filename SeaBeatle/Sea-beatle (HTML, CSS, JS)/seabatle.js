let gameLevel = 0; // Начальное состояние игры (расставляем корабли)
let playerHits = 0; // Количество попаданий игрока
let enemyHits = 0; // Количество попаданий противника

document.addEventListener("DOMContentLoaded", () => {
  const rules = document.querySelector('.rules');
  const rulesTrigger = document.querySelector('.rules-trigger');

  rulesTrigger.addEventListener('click', function () {
    rules.style.display = (rules.style.display === 'none') ? 'block' : 'none';
  });

  const playerBoard = document.getElementById('player-board-grid');
  const enemyBoard = document.getElementById('enemy-board-grid');
  const BoardSize = 100;
  let playerShips = 0;

  let PlayerCells = [];
  let EnemyCells = [];

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function createPlayerBoard() {
    for (let i = 0; i < BoardSize; i++) {
      const cell = document.createElement('div');
      cell.setAttribute('class', 'empty');
      cell.setAttribute('id', i);
      cell.setAttribute('name', 0);
      PlayerCells.push(cell);
      playerBoard.appendChild(cell);
    }
  }

  function createEnemyBoard() {
    for (let i = 0; i < BoardSize; i++) {
      const cell = document.createElement('div');
      cell.setAttribute('class', 'empty');
      cell.setAttribute('id', i);
      cell.setAttribute('name', 0);
      EnemyCells.push(cell);
      enemyBoard.appendChild(cell);
    }
  }

  function isShipClose(cell, cells) {
    const index = parseInt(cell.getAttribute('id'));
    const boardSize = Math.sqrt(BoardSize);
    const directions = [
      -1, 1,
      -boardSize, boardSize,
      -boardSize - 1, -boardSize + 1,
      boardSize - 1, boardSize + 1
    ];

    for (let dir of directions) {
      const neighborIndex = index + dir;
      if (neighborIndex >= 0 && neighborIndex < BoardSize && cells[neighborIndex] && cells[neighborIndex].classList.contains('ship')) {
        return true;
      }
    }

    return false;
  }

  function isKillClose(cell, cells) {
    const index = parseInt(cell.getAttribute('id'));
    const boardSize = Math.sqrt(BoardSize);
    const directions = [
      -1, 1,
      -boardSize, boardSize,
      -boardSize - 1, -boardSize + 1,
      boardSize - 1, boardSize + 1
    ];

    for (let dir of directions) {
      const neighborIndex = index + dir;
      if (neighborIndex >= 0 && neighborIndex < BoardSize && cells[neighborIndex] && cells[neighborIndex].classList.contains('kill')) {
        return true;
      }
    }

    return false;
  }

  function showMessage(message, cell) {
    const messageBox = document.createElement('div');
    messageBox.classList.add('message-box');
    messageBox.innerText = message;
    document.body.appendChild(messageBox);

    const rect = cell.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    messageBox.style.left = `${rect.left + scrollX + rect.width / 2}px`;
    messageBox.style.top = `${rect.top + scrollY + rect.height / 2}px`;

    if (message === "Попал!") {
      messageBox.style.backgroundColor = '#d4edda';
      messageBox.style.color = '#155724';
    }

    setTimeout(() => {
      messageBox.classList.add('show');
    }, 10);

    setTimeout(() => {
      messageBox.style.animation = 'fadeOut 0.5s forwards';
      setTimeout(() => {
        messageBox.remove();
      }, 500);
    }, 2000);
  }

  function handleCellClick(cell) {
    switch (gameLevel) {
      case 0:
        if (playerShips < maxPlayerShips && cell.classList.contains('empty') && cell.getAttribute('name') === '0' && !isShipClose(cell, PlayerCells)) {
          cell.classList.replace('empty', 'ship');
          playerShips++;
          const statusElement = document.getElementById("game-status");
          const remainingShips = maxPlayerShips - playerShips;
          statusElement.textContent = "Расставьте корабли: ещё " + remainingShips;
          if (playerShips >= maxPlayerShips) {
            startButton.disabled = false;
            startButton.style.visibility = "visible";
            startButton.style.backgroundColor = "#468c95";
          }
          if (remainingShips === 0) {
            statusElement.textContent = "Нажмите Начать игру";
          }
        } else if (cell.classList.contains('ship') && cell.getAttribute('name') === '0') {
          showMessage("Эта клетка уже занята кораблем!", cell);
        } else if (isShipClose(cell, PlayerCells)) {
          showMessage("Рядом есть корабль!", cell);
        } else if (playerShips >= maxPlayerShips) {
          showMessage("Вы расставили максимальное количество кораблей!", cell);
        }
        break;
      case 1:
        if (cell.classList.contains('empty') && cell.getAttribute('name') === '1') {
          cell.classList.replace('empty', 'miss');
          showMessage("Промах", cell);
          return true;
        } else if (cell.classList.contains('ship') && cell.getAttribute('name') === '1') {
          cell.classList.replace('ship', 'kill');
          showMessage("Попал!", cell);
          if (cell.parentElement.id === 'enemy-board-grid') {
            playerHits++;
          } else {
            enemyHits++;
          }
          return true;
        } else if (cell.classList.contains('kill')) {
          showMessage("Корабль уже подбит! Выбери другое поле", cell);
        } else if (cell.classList.contains('miss')) {
          showMessage("Сюда уже стрелял, выбери другое поле", cell);
        }
        return false;
      default:
        break;
    }
  }

  function toggleBoardClicks() {
    if (gameLevel === 1) {
      EnemyCells.forEach(cell => {
        cell.addEventListener('click', async function handleEnemyCellClick() {
          if (handleCellClick(cell)) {
            gameStatus.textContent = 'Ход противника...';
            await delay(1000);
            gameStatus.textContent = 'Ваш ход';

            let clickedCell;
            let count = 0;
            do {
              clickedCell = PlayerCells[Math.floor(Math.random() * PlayerCells.length)];
              count++;
            } while ((clickedCell.classList.contains('miss') || clickedCell.classList.contains('kill') || isKillClose(clickedCell, PlayerCells)) && count < 100);

            handleCellClick(clickedCell);

            if (playerHits >= maxPlayerShips || enemyHits >= maxPlayerShips) {
              gameStatus.textContent = playerHits >= maxPlayerShips ? 'Вы выиграли!' : 'Вы проиграли!';
              console.log(playerHits);
              console.log(enemyHits);
              PlayerCells.forEach(cell => {
                cell.style.pointerEvents = 'none';
              });
              EnemyCells.forEach(cell => {
                cell.style.pointerEvents = 'none';
              });
              EnemyCells.forEach(cell => cell.removeEventListener('click', handleEnemyCellClick));
              return;
            }
          }
        });
      });
    }
  }

  const restart = document.getElementById('restart');
  restart.addEventListener('click', function () {
    window.location.reload();
  });

  createPlayerBoard();
  createEnemyBoard();

  const shipCountInput = document.getElementById('ship-count');
  let maxPlayerShips = parseInt(shipCountInput.value);

  shipCountInput.addEventListener('input', function () {
    maxPlayerShips = parseInt(shipCountInput.value);
    const statusElement = document.getElementById("game-status");
    const remainingShips = maxPlayerShips - playerShips;
    statusElement.textContent = "Расставьте корабли: ещё " + remainingShips;
  });

  const startButton = document.getElementById('start-button');
  const gameStatus = document.getElementById('game-status');

  if (gameLevel === 0) {
    PlayerCells.forEach(cell => {
      cell.addEventListener('click', () => handleCellClick(cell));
    });
  }

  const randomButton = document.getElementById('random');
  randomButton.addEventListener('click', function () {
    playerShips = 0;
    PlayerCells.forEach(cell => {
      cell.classList.replace('ship', 'empty');
    });
    while (playerShips < maxPlayerShips) {
      let randomIndex = Math.floor(Math.random() * PlayerCells.length);
      let randomCell = PlayerCells[randomIndex];

      if (randomCell.classList.contains('empty') && !isShipClose(randomCell, PlayerCells)) {
        randomCell.classList.replace('empty', 'ship');
        playerShips++;
      }
    }
    startButton.disabled = false;
    startButton.style.visibility = "visible";
    startButton.style.backgroundColor = "#468c95";
    gameStatus.textContent = 'Нажмите Начать игру';
  });

  startButton.addEventListener('click', function () {
    gameStatus.textContent = 'Сделайте выстрел по полю противника';
    const shipcount = document.getElementById('ship-count');
    shipcount.disabled = true;
    randomButton.disabled = true;
    startButton.disabled = true;
    startButton.style.backgroundColor = "grey";
    randomButton.style.backgroundColor = "grey";

    let count = 0;
    while (count < maxPlayerShips) {
      let randomIndex = Math.floor(Math.random() * EnemyCells.length);
      let randomCell = EnemyCells[randomIndex];

      if (randomCell.classList.contains('empty') && !isShipClose(randomCell, EnemyCells)) {
        randomCell.classList.replace('empty', 'ship');
        count++;
      }
    }

    PlayerCells.forEach(cell => {
      cell.style.pointerEvents = 'none';
    });

    PlayerCells.forEach(cell => {
      cell.setAttribute('name', '1');
    });

    EnemyCells.forEach(cell => {
      cell.setAttribute('name', '1');
    });

    gameLevel = 1;
    toggleBoardClicks();
  });
});
