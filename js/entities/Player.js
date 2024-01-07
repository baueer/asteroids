class Player {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.speed = { x: 0, y: 0 };
        this.heading = 0;

        this.projectiles = [];
        this.lastProjectileTimestamp = 0;

        this.hitboxRadius = PLAYER_SIZE / Math.sqrt(3);
        this.respawnTime = 0;
        this.visible = true;
        this.blinking = false;

        this.lives = 1;
    }

    update() {
        this.visible = (Date.now() - this.respawnTime > PLAYER_RESPAWN_TIME);

        if (this.blinking && Date.now() > this.blinkEndTime) {
            this.blinking = false;
        }
        
        if (this.blinking && this.visible) {
            if (Date.now() % 300 < 150) {
                this.visible = false;
            } else {
                this.visible = true;
            }
        }

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        this.speed.x = this.applyFrictionAndLimitSpeed(this.speed.x);
        this.speed.y = this.applyFrictionAndLimitSpeed(this.speed.y);
        
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.heading);
        if (this.visible) {
            this.drawPlayer();
            this.drawTrajectory();
            this.drawHitbox();
        }
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

    drawHitbox() {
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 5]);
        this.ctx.arc(0, 0, this.hitboxRadius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
    }

    respawn() {
        this.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.speed = { x: 0, y: 0 };
        this.heading = 0;
        this.respawnTime = Date.now();
        this.visible = false;
        this.blinking = true;
        this.blinkEndTime = Date.now() + PLAYER_BLINKING_TIME;

        this.lives--;
    }
}