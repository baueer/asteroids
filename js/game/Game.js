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
        animation = window.requestAnimationFrame(this.gameLoop.bind(this));

        this.wave = 0;
        this.scoreMilestones = 0;

        this.stats = {
            score: null,
            asteroidsDestroyed: 0,
            projectilesFired: 0,
            projectilesHit: 0,
            duration: null
        };
    }

    gameLoop() {
        if (this.player.visible) {
            this.handleInputs();
        }
        if (!this.player.blinking) {
            this.handlePlayerCollision();
        }
        this.handleAsteroidCollision();
        this.handleProjectileCollision();

        this.update();
        animation = window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        if (state === GAME_STATE.PAUSED || state === GAME_STATE.GAMEOVER) {
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.update();
        this.asteroids.forEach((asteroid, index) => {
            if (asteroid.health <= 0) {
                this.asteroids.splice(index, 1);
                this.score += 10;
                this.stats.asteroidsDestroyed++;
            }
            asteroid.update();
        });
        this.player.projectiles.forEach(projectile => {
            projectile.update();
        });

        if (Math.floor(this.score / 150) > this.scoreMilestones) {
            this.scoreMilestones = Math.floor(this.score / 150);
            this.player.lives++;
        }

        waveSpan.innerText = this.wave;
        if (this.player.lives <= 0) {
            state = GAME_STATE.GAMEOVER;
            this.stats.duration = Math.round((Date.now() - startGameTime) / 1000);
            gameOverScoreSpan.innerText = this.score;
            updateUI();
        } else {
            livesSpan.innerText = "☆".repeat(this.player.lives); 
        }
        scoreSpan.innerText = this.score;
    }

    configureWaves() {
        let spawnedAsteroidsCount = 0;
        this.asteroidSpawnInterval = setInterval(() => {
            if (this.asteroids.length === 0) {
                this.wave++;
                if (this.wave > 1) {
                    this.score += 20;
                }
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
        this.asteroids.forEach((asteroid, index) => {
            if (asteroid.isCollidingWithPlayer(this.player)) {
                this.asteroids.splice(index, 1);
                this.stats.asteroidsDestroyed++;
                this.player.respawn();
            }
        });
    }

    handleProjectileCollision() {
        this.player.projectiles.forEach((projectile, index) => {
            this.asteroids.forEach(asteroid => {
                if (projectile.isCollidingWithAsteroid(asteroid)) {
                    this.score += 1;
                    this.player.projectiles.splice(index, 1);
                    asteroid.health--;
                    this.stats.projectilesHit++;
                }
            });
        });
    }
}