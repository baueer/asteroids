class Player {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 500;
        this.y = 500;
        this.size = 100;
    }

    update() {
        this.ctx.fillStyle = PLAYER_COLOR;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    moveLeft() {
        this.x -= 10;
    }

    moveRight() {
        this.x += 10;
    }
}