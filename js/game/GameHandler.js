const gameCanvas = document.getElementById("game");
// SCREENS
const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");
const pauseScreen = document.getElementById("pause-screen");
// BUTTONS
const startGameBtn = document.getElementById("start-game-btn");
const pauseButton = document.getElementById("pause-btn");
const resumeButton = document.getElementById("resume-btn");
const quitButton = document.getElementById("quit-btn");

let game = null;
let state = GAME_STATE.START;

function updateUI() {
    switch (state) {
        case GAME_STATE.START:
            homeScreen.style.display = "flex";
            gameScreen.style.display = "none";
            pauseScreen.style.display = "none";
            gameCanvas.style.display = "none";
            break;
        case GAME_STATE.RUNNING:
            homeScreen.style.display = "none";
            gameScreen.style.display = "flex";
            pauseScreen.style.display = "none";
            gameCanvas.style.display = "block";
            break;
        case GAME_STATE.PAUSED:
            homeScreen.style.display = "none";
            gameScreen.style.display = "flex";
            pauseScreen.style.display = "flex";
            gameCanvas.style.display = "block";
            break;
        case GAME_STATE.GAMEOVER:
            homeScreen.style.display = "none";
            gameScreen.style.display = "none";
            pauseScreen.style.display = "none";
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