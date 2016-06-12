// Here are the names and links for my group:
// Muni Bhupathi Dandu
// Roster #4
// http://120.34.43.111/Mwsu-2D-Gaming-Smith/Program-1
// http://github.com/smittyville/Mwsu-2D-Gaming-Smith/

// Shashank Namala
// Roster #15
// 107.170.129.29/Mwsu-2D-Gaming-namala/Program-1
// https://github.com/shashanknamala/Mwsu-2D-Gaming-namala/

// Main state fo the game
var mainState = {

    preload: function() {
        game.load.image('player', 'assets/pacman.png'); // Image for the Player Pacman
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
        game.load.image('coin', 'assets/fruit.png'); // Replaced coin image with fruit image
        game.load.image('enemy', 'assets/ghost.png'); // Replaced enemy image with ghost image 
    },

    create: function() { 
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
        
        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.createWorld();

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#00000f' });
        this.score = 0;
        //Added a Death counter on the bottom right hand corner
        this.DeathsLabel = game.add.text(403, 294, 'Deaths: 0', { font: '16px Arial', fill: '#00000f' }); 
        this.Deaths = 0;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(100, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
        
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
        game.physics.arcade.overlap(this.player, this.enemies, this.Deathcount, null, this);
        //game.physics.arcade.overlap(this.player, this.enemies, this.Death, null, this);

        this.movePlayer(); 

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
        else {
        this.endLabel = game.add.text(100, 135, 'END GAME', { font: '56px Arial', fill: '#00000f' });
        this.player.destroy();
        //game.lockRender=true;
            
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
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
        }
        else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -320;
        }      
    },

    takeCoin: function(player, coin) {
        this.score += 5;
        this.scoreLabel.text = 'score: ' + this.score;
        
        this.updateCoinPosition();
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
    
    // Function to update random position for the player
    updateplayerPosition: function() {
        var playerPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, 
            {x: 60, y: 140}, {x: 440, y: 140}, 
            {x: 130, y: 300}, {x: 370, y: 300} 
        ];

        for (var i = 0; i < playerPosition.length; i++) {
            if (playerPosition[i].x == this.player.x) {
                playerPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(playerPosition);
        //player.reset(600 + Math.random() * 1500, 220)
        //this.player.reset(newPosition.x, playerPosition.y);
        this.player.reset(newPosition.x, newPosition.y);
        
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
    
    // Creating the world required for the game
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

    //playerDie: function() {
        //player.destroy();
        //game.state.start('main');
    //},
};

// Creating new phaser game object 
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
var timer, timerEvent, text;
// Adding a state to the phaser game object
game.state.add('main', mainState);
// Starting the game state to run the game
game.state.start('main');


