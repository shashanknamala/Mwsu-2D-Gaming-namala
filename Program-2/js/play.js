var playState = {

    create: function() { 
        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.createWorld();

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'score: 0', 
            { font: '18px Arial', fill: '#ffffff' });
        game.global.score = 0; 
        
        //Added a Death counter on the bottom right hand corner
        this.DeathsLabel = game.add.text(403, 294, 'Deaths: 0', { font: '16px Arial', fill: '#ffffff' }); 
        this.Deaths = 0;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
        
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        
        
        // Create the 'right' animation by looping the frames 1 and 2
        this.player.animations.add('right');
        
        // Create the 'left' animation by looping the frames 3 and 4
        this.player.animations.add('left');
        
        // Add and start the music in the 'create' function of the play.js file
        // Because we want to play the music when the play state starts
        this.music = game.add.audio('music'); // Add the music
        this.music.loop = true; // Make it loop
        this.music.play(); // Start the music
        
        // Create the emitter with 15 particles. We don't need to set the x y
        // Since we don't know where to do the explosion yet
        this.emitter = game.add.emitter(0, 0, 15);

        // Set the 'pixel' image for the particles
        this.emitter.makeParticles('pixel');

        // Set the x and y speed of the particles between -150 and 150
        // Speed will be randomly picked between -150 and 150 for each particle
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);

        // Scale the particles from 2 time their size to 0 in 800ms
        // Parameters are: startX, endX, startY, endY, duration
        this.emitter.setScale(2, 0, 2, 0, 800);
        
        // Change the size of the emitter
        this.emitter.width = 100;
        this.emitter.height = 100;

        // Use no gravity
        this.emitter.gravity = 0;
        
        // Create a custom timer
        timer = game.time.create();
        
        // Create a delayed event 2 minutes from now
        timerEvent = timer.add(Phaser.Timer.MINUTE * 2 + Phaser.Timer.SECOND * 0, this.endTimer, this);
        
        // Start the timer
        timer.start();
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        this.movePlayer(); 

        if (!this.player.inWorld) {
            this.playerDie();
        }
        
        // If the player is dead, do nothing
        if (!this.player.alive) {
            return;
        }
        
        if (!this.player.inWorld) {
            this.player.kill();
            this.updateplayerPosition();
            this.Deaths += 1;
            this.DeathsLabel.text = 'Deaths: ' + this.Deaths;
           // this.playerDie();
        }
        // If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (timer.running) {
            game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 420, 42,{ font: '30px Arial', fill: '#ffffff' } );
        }

    },
    
    endTimer: function() {
        // Stop the timer when the delayed event triggers
        timer.stop();
    },
    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    },

    movePlayer: function() {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
            this.player.scale.x=-1;
            this.player.animations.play('left'); // Left animation
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
            this.player.scale.x=1;
            this.player.animations.play('right'); // Right animation
        }
        else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop(); // Stop animations
            this.player.frame = 0; // Change frame (stand still)
        }
        
        if(this.cursor.up.isDown){
            // Add this inside the 'movePlayer' function, in the 'if(player jumps)'
            this.jumpSound.play()
            
        }
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -320;
            
        }      
    },

    takeCoin: function(player, coin) {
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        
        // Scale the coin to 0 to make it invisible
        this.coin.scale.setTo(0, 0);
        // Grow the coin back to its original scale in 300ms
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
        game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100).yoyo(true).start();

        // Put this in the 'takeCoin' function
        this.coinSound.play();
        this.updateCoinPosition();
    },

    updateCoinPosition: function() {
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, 
            {x: 60, y: 140}, {x: 440, y: 140}, 
            {x: 130, y: 300}, {x: 370, y: 300} 
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(coinPosition);
        this.coin.reset(newPosition.x, newPosition.y);
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();

        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls); 
        game.add.sprite(480, 0, 'wallV', 0, this.walls); 
        game.add.sprite(0, 0, 'wallH', 0, this.walls); 
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls); 
        game.add.sprite(300, 320, 'wallH', 0, this.walls); 
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); 
        game.add.sprite(400, 160, 'wallH', 0, this.walls); 
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },
    
    startMenu: function() {
        game.state.start('menu');
    },

        // Death counter function gives the number of deaths
    Deathcount: function(player, enemies) {
        this.Deaths += 1;
        this.DeathsLabel.text = 'Deaths: ' + this.Deaths;
        //console.log(player);
        //console.log(enemies);
        //enemies.animations.play('die');
        enemies.kill();
        enemies.destroy();
        player.kill();
        
        this.updateplayerPosition(); // After player death calling updateplayerPosition function
    },
    
    
    playerDie: function() {
        
        this.player.kill();
        
        // Set the position of the emitter on top of the player
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        // Start the emitter by exploding 15 particles that will live 800ms
        this.emitter.start(true, 800, null, 15);
        // And this in the 'playerDie' function
        this.deadSound.play();
        // Call the 'startMenu' function in 1000ms
        game.time.events.add(1000, this.startMenu, this);
        
        // Flash the color white for 300ms
        game.camera.flash(0xffffff, 500);
        
        // Shake for 300ms with an intensity of 0.02
        game.camera.shake(0.04, 500);
        
        // And don't forget to stop the music in the 'playerDie' function
        // Otherwise the music would keep playing
        this.music.stop();
    },
};
