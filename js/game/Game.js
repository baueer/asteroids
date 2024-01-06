class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");

        this.score = 0;
        this.lives = 3;
        this.player = new Player(this.ctx, this.canvas);
        // this.asteroids = new Asteroid(this.ctx, this.canvas);

        this.keysPressed = {};
        this.configureEventListeners();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop() {
        this.handleInputs();
        this.update();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.update();
        // this.asteroids.update();
        this.player.projectiles.forEach(projectile => {
            projectile.update();
        });
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
}