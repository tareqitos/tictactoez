const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");
const show_player_turn = document.querySelector(".player");
const restart = document.querySelector(".restart");
const img = document.querySelector("img");
const audio = document.querySelectorAll(".sfx");
const music = document.querySelector(".music-btn");

const winCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

let playedCells = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "";
let isGameRunning = true;

function initializeGame() {
  board.innerHTML = "";
  board.previousElementSibling.src = `assets/tictactoe.png`;
  isGameRunning = true;
  playedCells = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "goku";
  show_player_turn.innerHTML = `<img src="assets/goku1.png" class="sprite">`;
  audio.forEach(audio => {
    audio.pause();
    audio.currenTime = 0;
  });

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
    cell.dataset.index = i;

    cell.addEventListener("click", handleEvent);
    cellHover(cell);
  }
}

function cellHover(cell) {
  if (!cell.classList.contains("taken")) {
    const cell_shadow = document.createElement("img");
    cell_shadow.classList.add("sprite", "shadow");
    cell_shadow.src = `assets/${currentPlayer}_hover.png`;
    cell_shadow.style.display = "none";
    cell.appendChild(cell_shadow);

    cell.addEventListener("mouseenter", () => {
      cell_shadow.style.display = "block";
    });
    cell.addEventListener("mouseleave", () => {
      cell_shadow.style.display = "none";
    });
  }
}

restart.addEventListener("click", initializeGame);

function handleEvent(event) {
  const cell = event.target;
  const index = cell.dataset.index;
  const sprites = document.querySelectorAll(".sprite");

  if (!isGameRunning || cell.classList.contains("taken")) {
    return;
  }

  sprites.forEach(sprite => {
    if (sprite.classList.contains("taken")) {
      return;
    }
  });

  if (show_player_turn.firstChild.classList.contains("fa-play")) {
    show_player_turn.firstChild.classList.replace("fa-play", "fa-rotate-left");
  }

  const randomPlayer = Math.floor(Math.random() * 5);
  cell.innerHTML = `<img src="assets/${currentPlayer}${randomPlayer}.png" class="sprite taken">`;
  cell.classList.add("taken");

  const randomSound = Math.floor(Math.random() * 3);
  playAudio("teleport", `sfx${randomSound}`, 0.5, false);

  playedCells[index] = currentPlayer;

  if (checkWin()) {
    cell.innerHTML = `<img src="assets/${currentPlayer}-win.png" class="sprite sprite-win">`;
    board.previousElementSibling.src = `assets/${currentPlayer}-win-text.png`;
    setTimeout(() => {
      playAudio("charge", "charge-loop", 0.5, true);
    }, 1300);
    playAudio("charge", "charge-start", 0.5, false);

    if (currentPlayer == "goku") {
      playAudio("voice", "goku-win", 1, false);
    } else {
      playAudio("voice", "vegeta-win", 1, false);
    }

    isGameRunning = false;
    return;
  } else if (checkDraw()) {
    board.previousElementSibling.src = `assets/draw-text.png`;
    isGameRunning = false;
    return;
  }

  currentPlayer = currentPlayer == "goku" ? "vegeta" : "goku";
  show_player_turn.innerHTML = `<img src="assets/${currentPlayer}${randomPlayer}.png" class="sprite">`;

}

function checkWin() {
  const winCombination = winCombinations.some(combination =>
    combination.every(index => playedCells[index] == currentPlayer)
  );
  return winCombination;
}

function checkDraw() {
  return playedCells.every(cell => cell !== "");
}

function playAudio(type, sound, volume, isLooping) {
  const sfx = document.querySelector(`.${type}`);

  sfx.src = `sounds/${sound}.ogg`;
  sfx.loop = isLooping;
  sfx.volume = volume;
  sfx.play();
}

music.addEventListener("click", () => {
  const bg = document.querySelector(".bg");
  let current_time;
  if (music.firstChild.classList.contains("fa-music")) {
    music.firstChild.classList.replace("fa-music", "fa-pause");
    bg.src = "sounds/prologue.ogg";
    bg.muted = false;
    bg.volume = 0.4;
    bg.loop = true;
    bg.play();
  } else {
    music.firstChild.classList.replace("fa-pause", "fa-music");
    bg.pause();
  }
});

initializeGame();
