class Projectile {
    constructor(ctx, canvas, position, heading) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.position = { x: position.x, y: position.y };
        this.heading = heading;

        this.createdAt = Date.now();
    }

    update() {
        this.position.x += PROJECTILE_SPEED * Math.sin(this.heading);
        this.position.y -= PROJECTILE_SPEED * Math.cos(this.heading);

        this.ctx.save();
        this.drawProjectile();
        this.ctx.restore();
    }
    
    drawProjectile() {
        this.ctx.fillStyle = PLAYER_COLOR;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, PROJECTILE_SIZE, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
    }
}