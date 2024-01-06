class Player {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.speed = { x: 0, y: 0 };
        this.heading = 0;

        this.projectiles = [];
        // this.projectile = new Projectile(this.ctx, this.canvas, {x: 500, y: 500}, 0);

        this.lastProjectileTimestamp = 0;

    }

    update() {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        this.speed.x = this.applyFrictionAndLimitSpeed(this.speed.x);
        this.speed.y = this.applyFrictionAndLimitSpeed(this.speed.y);
        
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.heading);
        this.drawPlayer();
        this.drawTrajectory();
        this.ctx.restore();

        this.projectiles = this.projectiles.filter(projectile => {
            return Date.now() - projectile.createdAt < PROJECTILE_DURATION;
        });
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
    }

    moveLeft() {
        this.speed.x -= PLAYER_MOVING_FORCE;
    }

    moveRight() {
        this.speed.x += PLAYER_MOVING_FORCE;
    }

    moveUp() {
        this.speed.y -= PLAYER_MOVING_FORCE;
    }

    moveDown() {
        this.speed.y += PLAYER_MOVING_FORCE;
    }

    rotateLeft() {
        this.heading -= PLAYER_ROTATION_SPEED;
    }

    rotateRight() {
        this.heading += PLAYER_ROTATION_SPEED;
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastProjectileTimestamp < PROJECTILE_COOLDOWN) {
            return;
        }

        this.projectiles.push(new Projectile(this.ctx, this.canvas, this.position, this.heading));
        this.lastProjectileTimestamp = now;

        console.log(this.projectiles);
    }

    applyFrictionAndLimitSpeed(speed) {
        if (speed > 0) {
            speed -= PLAYER_FRICTION_FORCE;
            speed = Math.max(0, speed);
        } else if (speed < 0) {
            speed += PLAYER_FRICTION_FORCE;
            speed = Math.min(0, speed);
        }

        speed = Math.max(-PLAYER_MAX_SPEED, Math.min(PLAYER_MAX_SPEED, speed));

        return speed;
    }

    drawPlayer() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -PLAYER_SIZE / 2);
        this.ctx.lineTo(-PLAYER_SIZE / 3, PLAYER_SIZE / 2);
        this.ctx.lineTo(PLAYER_SIZE / 3, PLAYER_SIZE / 2);
        this.ctx.closePath();
        this.ctx.fillStyle = PLAYER_COLOR;
        this.ctx.fill();
    }

    drawTrajectory() {
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 15]);
        this.ctx.moveTo(0, -PLAYER_SIZE / 2);
        this.ctx.lineTo(0, -PLAYER_SIZE*3);
        this.ctx.strokeStyle = PLAYER_COLOR;
        this.ctx.stroke();
    }
}