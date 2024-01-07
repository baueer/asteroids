class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");

        this.score = 0;
        this.player = new Player(this.ctx, this.canvas);
        this.asteroids = [];

        this.keysPressed = {};
        this.asteroidSpawnInterval = null;
        this.configureEventListeners();
        this.configureWaves();
        window.requestAnimationFrame(this.gameLoop.bind(this));

        this.wave = 0;
    }

    gameLoop() {
        if (this.player.visible) {
            this.handleInputs();
        }
        if (!this.player.blinking) {
            this.handlePlayerCollision();
        }
        this.handleAsteroidCollision();

        this.update();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        if (state === GAME_STATE.PAUSED || state === GAME_STATE.GAMEOVER) {
            return;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.update();
        this.asteroids.forEach(asteroid => {
            asteroid.update();
        });
        this.player.projectiles.forEach(projectile => {
            projectile.update();
        });

        waveSpan.innerText = this.wave;
        if (this.player.lives <= 0) {
            state = GAME_STATE.GAMEOVER;
            updateUI();
        } else {
            livesSpan.innerText = "☆".repeat(this.player.lives); 
        }
    }

    configureWaves() {
        let spawnedAsteroidsCount = 0;
        this.asteroidSpawnInterval = setInterval(() => {
            if (this.asteroids.length === 0) {
                this.wave++;
                spawnedAsteroidsCount = 0;
            }
            if (spawnedAsteroidsCount < this.wave * ASTEROIDS_WAVE_MULTIPLIER) {
                this.asteroids.push(new Asteroid(this.ctx, this.canvas));
                spawnedAsteroidsCount++;
            }
        }, ASTEROIDS_WAVE_INTERVAL);
    }

    configureEventListeners() {
        window.addEventListener("keydown", (e) => {
            this.keysPressed[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.keysPressed[e.key] = false;
        });
    }

    handleInputs() {
        if (this.keysPressed["ArrowLeft"]) {
            this.player.moveLeft();
        }
        if (this.keysPressed["ArrowRight"]) {
            this.player.moveRight();
        }
        if (this.keysPressed["ArrowUp"]) {
            this.player.moveUp();
        }
        if (this.keysPressed["ArrowDown"]) {
            this.player.moveDown();
        }
        if (this.keysPressed["z"]) {
            this.player.rotateLeft();
        }
        if (this.keysPressed["c"]) {
            this.player.rotateRight();
        }
        if (this.keysPressed["x"]) {
            this.player.shoot();
        }
    }

    handleAsteroidCollision() {
        for (let i = 0; i < this.asteroids.length; i++) {
            for (let j = i + 1; j < this.asteroids.length; j++) {
                this.asteroids[i].bounceOff(this.asteroids[j]);
            }
        }
    }

    handlePlayerCollision() {
        this.asteroids.forEach(asteroid => {
            if (asteroid.isCollidingWithPlayer(this.player)) {
                this.player.respawn();
            }
        });
    }
}