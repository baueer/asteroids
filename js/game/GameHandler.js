const gameCanvas = document.getElementById("game");
// SCREENS
const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");
const pauseScreen = document.getElementById("pause-screen");
const gameOverScreen = document.getElementById("game-over-screen");
// BUTTONS
const startGameBtn = document.getElementById("start-game-btn");
const statsButton = document.getElementById("stats-btn");
const pauseButton = document.getElementById("pause-btn");
const resumeButton = document.getElementById("resume-btn");
const quitButton = document.getElementById("quit-btn");
const saveButton = document.getElementById("save-btn");
const restartButton = document.getElementById("restart-btn");
const menuButton = document.getElementById("menu-btn");
// SPANS
const scoreSpan = document.getElementById("score-count");
const livesSpan = document.getElementById("lives-count");
const waveSpan = document.getElementById("wave-count");

let game = null;
let state = GAME_STATE.START;
let animation = null;

function updateUI() {
    switch (state) {
        case GAME_STATE.START:
            homeScreen.style.display = "flex";
            gameScreen.style.display = "none";
            pauseScreen.style.display = "none";
            gameOverScreen.style.display = "none";
            gameCanvas.style.display = "none";
            break;
        case GAME_STATE.RUNNING:
            homeScreen.style.display = "none";
            gameScreen.style.display = "flex";
            pauseScreen.style.display = "none";
            gameOverScreen.style.display = "none";
            gameCanvas.style.display = "block";
            break;
        case GAME_STATE.PAUSED:
            homeScreen.style.display = "none";
            gameScreen.style.display = "flex";
            pauseScreen.style.display = "flex";
            gameOverScreen.style.display = "none";
            gameCanvas.style.display = "block";
            break;
        case GAME_STATE.GAMEOVER:
            homeScreen.style.display = "none";
            gameScreen.style.display = "none";
            pauseScreen.style.display = "none";
            gameOverScreen.style.display = "flex";
            gameCanvas.style.display = "block";
            break;
    }
}

startGameBtn.addEventListener("click", () => {
    state = GAME_STATE.RUNNING;
    updateUI();

    game = new Game(gameCanvas);
});

pauseButton.addEventListener("click", () => {
    state = GAME_STATE.PAUSED;
    updateUI();
});

resumeButton.addEventListener("click", () => {
    state = GAME_STATE.RUNNING;
    updateUI();
});

quitButton.addEventListener("click", () => {
    state = GAME_STATE.START;
    updateUI();
});

restartButton.addEventListener("click", () => {
    endGame();

    state = GAME_STATE.RUNNING;
    updateUI();

    game = new Game(gameCanvas);
});

menuButton.addEventListener("click", () => {
    endGame();

    state = GAME_STATE.START;
    updateUI();
});

function endGame() {
    game = null;
    if (animation) {
        window.cancelAnimationFrame(animation);
        animation = null;
    }
}

function saveScore() {
}