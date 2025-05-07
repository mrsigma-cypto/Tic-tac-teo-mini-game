const board = document.getElementById('gameBoard');
const currentPlayerDisplay = document.getElementById('current-player');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const homeScreen = document.getElementById('homeScreen');
const gameScreen = document.getElementById('gameScreen');
const popup = document.getElementById('endPopup');
const popupMessage = document.getElementById('popupMessage');
const popupRestartBtn = document.getElementById('popupRestartBtn');
const darkToggle = document.getElementById('darkModeToggle');

let gameState = ['', '', '', '', '', '', '', '', ''];
let humanPlayer = 'X';
let aiPlayer = 'O';
let gameActive = true;
let currentTurn = 'X'; // Track whose turn

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

startBtn.addEventListener('click', () => {
  homeScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  restartGame();
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

function renderBoard() {
  board.innerHTML = '';
  gameState.forEach((val, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', index);
    cell.textContent = val;
    if (val === 'X') cell.classList.add('x');
    if (val === 'O') cell.classList.add('o');
    cell.addEventListener('click', () => handleHumanMove(index));
    board.appendChild(cell);
  });
}

function handleHumanMove(index) {
  if (!gameState[index] && gameActive && currentTurn === humanPlayer) {
    gameState[index] = humanPlayer;
    renderBoard();
    if (checkGameOver(humanPlayer)) return;

    currentTurn = aiPlayer;
    updateTurnLabel();

    setTimeout(() => {
      const move = getNormalAIMove();
      if (move !== undefined) {
        gameState[move] = aiPlayer;
        renderBoard();
        if (!checkGameOver(aiPlayer)) {
          currentTurn = humanPlayer;
          updateTurnLabel();
        }
      }
    }, 400);
  }
}

function checkGameOver(player) {
  if (checkWinner(player)) {
    showPopup(player === humanPlayer ? "Congratulations! You win!" : "Oh no! You lost, but try again!");
    gameActive = false;
    return true;
  }
  if (!gameState.includes('')) {
    showPopup("Oh! It's a draw.");
    gameActive = false;
    return true;
  }
  return false;
}

function checkWinner(player) {
  return winPatterns.some(pattern =>
    pattern.every(i => gameState[i] === player)
  );
}

function getNormalAIMove() {
  for (let i = 0; i < 9; i++) {
    if (!gameState[i]) {
      gameState[i] = aiPlayer;
      if (checkWinner(aiPlayer)) {
        gameState[i] = '';
        return i;
      }
      gameState[i] = '';
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!gameState[i]) {
      gameState[i] = humanPlayer;
      if (checkWinner(humanPlayer)) {
        gameState[i] = '';
        return i;
      }
      gameState[i] = '';
    }
  }
  if (!gameState[4]) return 4;
  const available = gameState
    .map((v, i) => (v === '' ? i : null))
    .filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = 'flex';
}

function restartGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentTurn = humanPlayer;
  updateTurnLabel();
  popup.style.display = 'none';
  renderBoard();
}

function updateTurnLabel() {
  if (currentTurn === humanPlayer) {
    currentPlayerDisplay.textContent = "Your Turn: X";
  } else {
    currentPlayerDisplay.textContent = "Computer's Turn: O";
  }
}

restartBtn.addEventListener('click', restartGame);
popupRestartBtn.addEventListener('click', restartGame);
