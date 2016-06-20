var SpaceHipster = SpaceHipster || {};

//title screen
SpaceHipster.MainMenu = function(){};

SpaceHipster.MainMenu.prototype = {
  init: function(score) {
    var score = score || 0;
    this.highestScore = this.highestScore || 0;

    this.highestScore = Math.max(score, this.highestScore);
   },
  create: function() {
  	//show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    
    //give it speed in x
    this.background.autoScroll(-20, 0);

    //start game text
      
          var text = "Space Hipster";
    var style = { font: "150px Geo", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/4, text, style);
    t.anchor.set(0.5);
      
    var text = "Press E : Easy M: Medium H: Hard";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);

    //highest score
    text = "Highest score: "+this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
    h.anchor.set(0.5);
      
      this.cursor = this.game.input.keyboard.createCursorKeys();
        this.option = {
          easy: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
          medium: this.game.input.keyboard.addKey(Phaser.Keyboard.M),
          hard: this.game.input.keyboard.addKey(Phaser.Keyboard.H),
        }
  },
  update: function() {
    if(this.option.easy.isDown) {
        this.skillLevel=0;
        this.game.state.start('Game');
    }
    else if (this.option.medium.isDown) {
        this.skillLevel=1;
        this.game.state.start('Game');
    }
    else if (this.option.hard.isDown) {
        this.skillLevel=2;
        this.game.state.start('Game');
    }
    else {
        this.cursor.easy=false;
        this.cursor.medium=false;
        this.cursor.hard=false;
    }
},
};