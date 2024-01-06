class Asteroid {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.position = {
            x: Math.floor(Math.random() * this.canvas.width),
            y: Math.floor(Math.random() * this.canvas.height)
        };
        this.radius = ASTEROID_SIZE;
        this.speed = Math.floor(Math.random() * 5) + 1;
        this.heading = Math.floor(Math.random() * 360) * Math.PI / 180;

        this.health = 4;
        this.createdAt = Date.now();
    }

    update() {
        this.position.x += this.speed * Math.sin(this.heading);
        this.position.y -= this.speed * Math.cos(this.heading);

        if (this.position.x < 0) {
            this.position.x = this.canvas.width;
        } else if (this.position.x > this.canvas.width) {
            this.position.x = 0;
        }
    
        if (this.position.y < 0) {
            this.position.y = this.canvas.height;
        } else if (this.position.y > this.canvas.height) {
            this.position.y = 0;
        }

        this.ctx.save();
        this.drawAsteroid();
        this.drawHealthText();
        this.ctx.restore();
    }

    drawAsteroid() {
        this.ctx.strokeStyle = ASTEROID_COLOR;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawHealthText() {
        this.ctx.fillStyle = ASTEROID_COLOR;
        this.ctx.font = "22px Chakra Petch";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.health, this.position.x, this.position.y);
    }

    bounceOff(collidingAsteroid) {
        const dx = collidingAsteroid.position.x - this.position.x;
        const dy = collidingAsteroid.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + collidingAsteroid.radius) {
            const collisionAngle = Math.atan2(dy, dx);
            this.heading = (2 * collisionAngle - this.heading) % (2 * Math.PI);
            collidingAsteroid.heading = (2 * collisionAngle - collidingAsteroid.heading) % (2 * Math.PI);

            const tempSpeed = this.speed;
            this.speed = collidingAsteroid.speed;
            collidingAsteroid.speed = tempSpeed;

            const overlap = this.radius + collidingAsteroid.radius - distance;
            const separationVector = {x: dx / distance * overlap, y: dy / distance * overlap};
            this.position.x -= separationVector.x;
            this.position.y -= separationVector.y;
            collidingAsteroid.position.x += separationVector.x;
            collidingAsteroid.position.y += separationVector.y;
        }
    }

}