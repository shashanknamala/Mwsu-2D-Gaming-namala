var menuState = {

    create: function() { 
        game.add.image(0, 0, 'background');

        // Changed the y position to -50 so we don't see the label
        var nameLabel = game.add.text(game.width/6, -50, '  SmIlEy PaCmAn', { font: '50px Geo', fill: '#ffffff' });

        // Create a tween on the label
        var tween = game.add.tween(nameLabel);

        // Change the y position of the label to 80 in 1000 ms
        tween.to({y: 80}, 1000);

        // Start the tween
        tween.start();
        
       

        //var scoreLabel = game.add.text(game.width/2, game.height/2, 'score: ' + game.global.score, { font: '25px Arial', fill: '#ffffff' });
        //scoreLabel.anchor.setTo(0.5, 0.5);
        
        // If 'bestScore' is not defined
        // It means that this is the first time the game is played
        if (!localStorage.getItem('bestScore')) {
            // Then set the best score to 0
            localStorage.setItem('bestScore', 0);
        }
        // If the score is higher than the best score
        if (game.global.score > localStorage.getItem('bestScore')) {
            // Then update the best score
            localStorage.setItem('bestScore', game.global.score);
        }
        
        // Add the button that calls the 'toggleSound' function when pressed
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound,this);
        
        var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
        var scoreLabel = game.add.text(game.width/3, game.height/2.5, text, { font: '25px Geo', fill: '#ffffff', align: 'center' });

        // Store the relevant text based on the device used
        var text;
        if (game.device.desktop) {
            text = 'Press the up arrow key to start';
        }
        else {
            text = 'Touch the screen to start';
        }
        // Display the text variable
        var startLabel = game.add.text(game.width/2, game.height-80, text, { font: '25px Geo', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        

        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start, this);
        
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.add(this.start, this);
        
        if (!game.device.desktop) {
            game.input.onDown.add(this.start, this);
        }
        
        
        game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
        
        // Create the tween
        var tween = game.add.tween(startLabel);
        // Rotate the label to -2 degrees in 500ms
        tween.to({angle: -2}, 500);
        // Then rotate the label to +2 degrees in 1000ms
        tween.to({angle: 2}, 1000);
        // And get back to our initial position in 500ms
        tween.to({angle: 0}, 500);
        // Loop indefinitely the tween
        tween.loop();
        // Start the tween
        tween.start();
        
        game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();
    },

    start: function() {
        game.state.start('play');
        // If we tap in the top left corner of the game on mobile
        if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
            // It means we want to mute the game, so we don't start the game
            return;
        }
    },
    
    // Function called when the 'muteButton' is pressed
    toggleSound: function() {
        // Switch the variable from true to false, or false to true
        // When 'game.sound.mute = true', Phaser will mute the game
        game.sound.mute = !game.sound.mute;
        // Change the frame of the button
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
};