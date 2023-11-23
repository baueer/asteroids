class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.player = new Player(this.ctx);

        this.keysPressed = {};
        this.state = GAME_STATE.START;
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
    }
}