var SpaceHipster = SpaceHipster || {};

//title screen
SpaceHipster.Game = function(){};

var SkillLevel = SkillLevel || {};

SkillLevel.easy = [25,50];
SkillLevel.medium = [100,150];
SkillLevel.hard = [200,250];

var sprite;
var cursors;

var bullets;
var bulletTime = 0;

SpaceHipster.Game.prototype = {
  create: function() {
      
  	//set world dimensions
    this.game.world.setBounds(0, 0, 1920, 1920);

    //background
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');


    //player initial score of zero
    this.playerScore = 0;

    //the camera will follow the player in the world
    this.game.camera.follow(this.sprite);

    //generate game elements
    this.generateCollectables();
    this.generateAsteriods();

    //show score
    this.showLabels();

    //sounds
    this.explosionSound = this.game.add.audio('explosion');
    //console.log(this.explosionSound);
    this.collectSound = this.game.add.audio('collect');
      
    //  Our bullet group
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(10, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    //  Our player ship
    this.sprite = this.game.add.sprite(300, 300, 'playership');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.setTo(2);
      
          //enable player physics
    this.game.physics.arcade.enable(this.sprite);
    this.playerSpeed = 120;
    this.sprite.body.collideWorldBounds = true;

    //  and its physics settings
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.drag.set(100);
    this.sprite.body.maxVelocity.set(200);

    //  Game input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    //this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      
      
  },
  update: function() {

  
    if (this.cursors.up.isDown)
    {
        this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 200, this.sprite.body.acceleration);
    }
    else
    {
        this.sprite.body.acceleration.set(0);
    }

    if (this.cursors.left.isDown)
    {
        this.sprite.body.angularVelocity = -300;
    }
    else if (this.cursors.right.isDown)
    {
        this.sprite.body.angularVelocity = 300;
    }
    else
    {
        this.sprite.body.angularVelocity = 0;
    }

    if (this.fireButton.isDown)
    {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        this.bullet = this.bullets.getFirstExists(false);

        if (this.bullet)
        {
            this.bullet.reset(this.sprite.body.x+16, this.sprite.body.y + 16);
            this.bullet.lifespan = 1200;
            this.bullet.rotation = this.sprite.rotation;
            this.game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
            this.bulletTime = this.game.time.now-1000;
        }
    }
    }
    
      //this.screenWrap(this.sprite);
      //collision between player and asteroids
    this.game.physics.arcade.collide(this.sprite, this.asteroids, this.hitasteroids, null, this);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.sprite, this.collectables, this.collect, null, this);
    this.game.physics.arcade.overlap(this.bullets, this.asteroids, this.collisionHandler, null, this);
    this.game.physics.arcade.overlap(this.bullets, null, null, null, this);
  },
    
    screenWrap: function(sprite) {

    if (this.sprite.x < 0)
    {
        this.sprite.x = this.game.width;
    }
    else if (this.sprite.x > this.game.width)
    {
        this.sprite.x = 0;
    }

    if (this.sprite.y < 0)
    {
        this.sprite.y = this.game.height;
    }
    else if (this.sprite.y > this.game.height)
    {
        this.sprite.y = 0;
    }

},
    
  generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    if (this.skillLevel == 0)
          {
                  //phaser's random number generator
                var numCollectables = this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1]);
                var collectable;

                for (var i = 0; i < numCollectables; i++) {
                  //add sprite
                  collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
                  collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
                  collectable.animations.play('fly');
                }
              
          }
      else if (this.skillLevel == 1)
          {
              //phaser's random number generator
                var numCollectables = this.game.rnd.integerInRange(SkillLevel.medium[0], SkillLevel.medium[1]);
                var collectable;

                for (var i = 0; i < numCollectables; i++) {
                  //add sprite
                  collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
                  collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
                  collectable.animations.play('fly');
                }
          }
      else 
          {
              //phaser's random number generator
                var numCollectables = this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.hard[1]);
                var collectable;

                for (var i = 0; i < numCollectables; i++) {
                  //add sprite
                  collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
                  collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
                  collectable.animations.play('fly');
                }
          }

      
      
  },
    
    
    collisionHandler: function(bullet, asteroids) {

        
    //  When a bullet hits an alien we kill them both
        bullet.kill();
        
     //make the player explode
    var emitter = this.game.add.emitter(asteroids.x,asteroids.y, 100);
        console.log(this.asteroids.x);
    emitter.makeParticles('pixel');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
        asteroids.kill();
        this.explosionSound.play();
},
    
    
    resetBullet: function(bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

},

  generateAsteriods: function() {
    this.asteroids = this.game.add.group();
    
    //enable physics in them
    this.asteroids.enableBody = true;

    //phaser's random number generator
if (this.skillLevel == 0)
          {
               
                //phaser's random number generator
                var numAsteroids = this.game.rnd.integerInRange(killLevel.easy[0], SkillLevel.easy[1])
                var asteriod;

                for (var i = 0; i < numAsteroids; i++) {
                  //add sprite
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1])/40);

                  //physics properties
                  asteriod.body.velocity.x = this.game.rnd.pick([-20,20]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-20,20]);
                    //asteriod.body.bounce.x=10;
                    //asteriod.body.bounce.y=10;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
          }
      else if (this.skillLevel == 1)
          {
               
                //phaser's random number generator
                var numAsteroids = this.game.rnd.integerInRange(killLevel.easy[0], SkillLevel.easy[1])
                var asteriod;

                for (var i = 0; i < numAsteroids/2; i++) {
                  //add sprite
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.medium[0], SkillLevel.medium[1]/30));

                  //physics properties
                  asteriod.body.velocity.x = this.game.rnd.pick([-40,40]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-40,40]);
                    asteriod.body.bounce.x=.6;
                    asteriod.body.bounce.y=.6;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
                for (var i = 0; i < numAsteroids/2; i++) {
                  //add sprite
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.medium[0], SkillLevel.medium[1]/80));

                  //physics properties
                  asteriod.body.velocity.x = this.game.rnd.pick([-45,45]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-45,45]);
                    asteriod.body.bounce.x=1;
                    asteriod.body.bounce.y=1;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
          }
      else
          {
               
                //phaser's random number generator
                var numAsteroids = this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1])
                var asteriod;

                for (var i = 0; i < numAsteroids/2; i++) {
                  //add sprite
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.easy[1])/20);
                  //physics properties
                  asteriod.body.velocity.x = this.game.rnd.pick([-60,60]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-60,60]);
                    asteriod.body.bounce.x=1;
                    asteriod.body.bounce.y=1;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
              for (var i = 0; i < numAsteroids/2; i++) {
                  //add sprite
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.easy[1])/80);
                  //physics properties
                  asteriod.body.velocity.x = this.game.rnd.pick([-80,80]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-80,80]);
                    asteriod.body.bounce.x=2;
                    asteriod.body.bounce.y=2;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
          }
  },
  hitasteroids: function(player, asteroids) {
    //play explosion sound
    this.explosionSound.play();

    //make the player explode
    var emitter = this.game.add.emitter(this.sprite.x, this.sprite.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.sprite.kill();

    this.game.time.events.add(800, this.gameOver, this);
  },
  gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;

    //remove this.sprite
    collectable.destroy();
  },
  showLabels: function() {
    //score text
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  }
};

/*
TODO

-audio
-asteriod bounch
*/
