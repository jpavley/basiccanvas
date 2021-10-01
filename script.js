window.addEventListener('load', function() {

    // get and configure the canvas
    const canvas = document.getElementById('canvas1');
    canvas.width = 500;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;

            // sprite management
            this.sprites = [];
            this.spriteAddInterval = 1000; // add/remove a sprite every 1000ms
            this.spriteAddTimer = 0;
        }

        update(deltaTime) {
            if (this.spriteAddTimer > this.spriteAddInterval) {

                // remove and add sprites every 1000ms
                this.sprites = this.sprites.filter(s => !s.deleteMe);
                this.#createSprite();
                console.log(this.sprites);
                this.spriteAddTimer = 0;
            } else {
                this.spriteAddTimer += deltaTime; // ensure timing is the same for slow and fast machines
            }

            // update sprites every frame
            this.sprites.forEach(s => s.update(deltaTime));
        }

        draw() {

            // draw background
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // draw forground
            this.sprites.forEach(s => s.draw(this.ctx));
        }

        #createSprite() {
            this.sprites.push(new Sprite(this));
            this.sprites.sort(function(a, b) {
                // higher sprites will be drawn before lower sprites
                return a.y - b.y;
            });
        }
    }

    class Sprite {
        constructor(game) {
            this.game = game;
            this.deleteMe = false;

            this.alphas = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1,
                                0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
            this.frameX = 0;
            this.frameCount = this.alphas.length;

            this.frameInterval = 300;
            this.frameTimer = 0;

            this.width = 80;
            this.height = 70;

            this.x = this.game.width * Math.random();
            this.y = 0 - this.height;
            this.vy = Math.random() * 0.1 + 0.1;

        }

        update(deltaTime) {
            // animate frame every 300ms
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.frameCount) {
                    // advance animation frame
                    this.frameX += 1;
                } else {
                    // reset animation frame
                    this.frameX = 0;
                }
                // reset frame timer
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime; // ensure timing is the same for slow and fast machines
            }

            // mark sprite for removal when out of bounds
            if (this.y < 0 - this.height * 2) {
                // remove from game
                this.deleteMe = true;
            }

            // move sprite every frame
            if (this.y < 0 - this.height * 2) {
                // remove from game
                this.markedForDeletion = true;
            }

            this.y += this.vy * deltaTime;
            if (this.y > this.game.height - this.height) {
                this.vy *= -1; // transform to negative
            }
        }

        draw(ctx) {
            ctx.fillStyle = 'white';
            ctx.globalAlpha = this.alphas[this.frameX];
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTime = 1;
    function animate(timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // deltaTime: elapsed time between frames
        // faster computer, small value for deltaTime
        // slower computer, larger value for deltaTime
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw();
        //console.log(deltaTime);
        requestAnimationFrame(animate);
    }

    animate(0);
});