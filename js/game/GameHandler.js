const gameCanvas = document.getElementById("game");
// SCREENS
const homeScreen = document.getElementById("home-screen");
const statsScreen = document.getElementById("stats-screen");
const gameScreen = document.getElementById("game-screen");
const pauseScreen = document.getElementById("pause-screen");
const gameOverScreen = document.getElementById("game-over-screen");
// BUTTONS
const startGameBtn = document.getElementById("start-game-btn");
const statsButton = document.getElementById("stats-btn");
const backButton = document.getElementById("back-btn");
const pauseButton = document.getElementById("pause-btn");
const resumeButton = document.getElementById("resume-btn");
const quitButton = document.getElementById("quit-btn");
const saveButton = document.getElementById("save-btn");
const restartButton = document.getElementById("restart-btn");
const menuButton = document.getElementById("menu-btn");
// SPANS
const highScoreHomeSpan = document.getElementById("high-score");
const scoreSpan = document.getElementById("score-count");
const livesSpan = document.getElementById("lives-count");
const waveSpan = document.getElementById("wave-count");
const gameOverScoreSpan = document.getElementById("game-over-score");
const highScoreSpan = document.getElementById("stat-high-score");
const gamesPlayedSpan = document.getElementById("stat-games-played");
const mostSurvivedSpan = document.getElementById("stat-most-survived");
// INPUTS
const nameInput = document.getElementById("name-input");

let game = null;
let state = GAME_STATE.START;
let animation = null;

let startGameTime = null;

function updateUI() {
    switch (state) {
        case GAME_STATE.START:
            homeScreen.style.display = "flex";
            statsScreen.style.display = "none";
            gameScreen.style.display = "none";
            pauseScreen.style.display = "none";
            gameOverScreen.style.display = "none";
            gameCanvas.style.display = "none";
            break;
        case GAME_STATE.STATS:
            homeScreen.style.display = "none";
            statsScreen.style.display = "flex";
            gameScreen.style.display = "none";
            pauseScreen.style.display = "none";
            gameOverScreen.style.display = "none";
            gameCanvas.style.display = "none";
            break;
        case GAME_STATE.RUNNING:
            homeScreen.style.display = "none";
            statsScreen.style.display = "none";
            gameScreen.style.display = "flex";
            pauseScreen.style.display = "none";
            gameOverScreen.style.display = "none";
            gameCanvas.style.display = "block";
            break;
        case GAME_STATE.PAUSED:
            homeScreen.style.display = "none";
            statsScreen.style.display = "none";
            gameScreen.style.display = "flex";
            pauseScreen.style.display = "flex";
            gameOverScreen.style.display = "none";
            gameCanvas.style.display = "block";
            break;
        case GAME_STATE.GAMEOVER:
            homeScreen.style.display = "none";
            statsScreen.style.display = "none";
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

    startGame();
});

statsButton.addEventListener("click", () => {
    state = GAME_STATE.STATS;
    updateUI();
    fetchStats();
});

backButton.addEventListener("click", () => {
    state = GAME_STATE.START;
    updateUI();
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
    endGame();

    state = GAME_STATE.START;
    updateUI();
});

restartButton.addEventListener("click", () => {
    endGame();

    state = GAME_STATE.RUNNING;
    updateUI();

    startGame();
});

menuButton.addEventListener("click", () => {
    endGame();

    state = GAME_STATE.START;
    updateUI();
});

function startGame() {
    game = new Game(gameCanvas);
    startGameTime = new Date();
}

function endGame() {
    saveScore();

    game = null;
    if (animation) {
        window.cancelAnimationFrame(animation);
        animation = null;
    }
}

function saveScore() {
    if (game.score === 0) {
        return;
    }
    let games = JSON.parse(localStorage.getItem("games")) || [];
    games.push({
        name: nameInput.value || "Gigel",
        score: game.score,
        duration: game.stats.duration,
        asteroidsDestroyed: game.stats.asteroidsDestroyed,
        projectilesFired: game.stats.projectilesFired,
        projectilesHit: game.stats.projectilesHit,
        date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    });
    localStorage.setItem("games", JSON.stringify(games));
}

function fetchStats() {
    const scores = JSON.parse(localStorage.getItem("games")) || [];
    scores.sort((a, b) => b.score - a.score);

    const topScores = scores.slice(0, 5);
    let highScoresTable = document.getElementById("high-scores-table");
    highScoresTable.innerHTML = "";
    if (scores.length === 0) {
        let row = document.createElement("div");
        row.innerHTML = `
            <span>No scores yet</span>
        `;
        highScoresTable.appendChild(row);
    } else {
        let row = document.createElement("tr");
        row.innerHTML = `
            <th>Name</th>
            <th>Score</th>
            <th>Survived</th>
            <th>Date</th>
        `;
        highScoresTable.appendChild(row);
    }
    topScores.forEach(score => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${score.name}</td>
            <td>${score.score}</td>
            <td>${formatTime(score.duration)}</td>
            <td>${score.date}</td>
        `;
        highScoresTable.appendChild(row);
    });

    highScoreSpan.innerText = scores.reduce((acc, curr) => Math.max(acc, curr.score), 0);
    gamesPlayedSpan.innerText = scores.length;
    let mostSurvived = scores.reduce((acc, curr) => Math.max(acc, curr.duration), 0);
    mostSurvivedSpan.innerText = formatTime(mostSurvived);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsLeft = seconds % 60;

    if (minutes === 0) {
        return `${secondsLeft}s`;
    }
    return `${minutes}m ${secondsLeft}s`;
}