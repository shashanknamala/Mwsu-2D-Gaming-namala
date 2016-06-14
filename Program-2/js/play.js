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

    playerDie: function() {
        // And this in the 'playerDie' function
        this.deadSound.play();
        game.state.start('menu');
        
        // Flash the color white for 300ms
        game.camera.flash(0xffffff, 300);
        
        // Shake for 300ms with an intensity of 0.02
        game.camera.shake(0.02, 300);
        
        // And don't forget to stop the music in the 'playerDie' function
        // Otherwise the music would keep playing
        this.music.stop();
    },
};
