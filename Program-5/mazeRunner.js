(function() {
    "use strict";

    var playerSize = 30;
    var canvas = document.getElementById("mazecanvas");

    var maze = {
        BOARDER: 1,
        WALL: 2,
        EXIT: 4,
        ENTRANCE: 8,
        PATH: 16,
        TRACE: 512,
        PLAYER: 1024,
        
        cells: [],

        canvasContext: canvas.getContext("2d"),

        PLAYER_SIZE : playerSize,
        width: canvas.width /playerSize,
        height: canvas.height / playerSize
    }

    var currX = 0;
    var currY = 0;

    jsmaze.generateMaze(maze);
    jsmaze.drawMaze(maze);

    movePlayer(1, 0);
    window.addEventListener("keydown", handleKeyPress, true);

    function isMoveValid(x, y) {
        return (maze.cells[currX + x][currY + y] & (maze.PATH | maze.EXIT | maze.ENTRANCE));
    }

    function movePlayer(x, y) {
        if (isMoveValid(x, y)) {
            jsmaze.drawBlock(maze, currX, currY, maze.cells[currX][currY]);

            currX += x;
            currY += y;
            jsmaze.drawBlock(maze, currX, currY, maze.PLAYER);

            if (maze.cells[currX][currY] == maze.EXIT) {
                alert("You made it!");
            }
        }
    }


    function handleKeyPress(e) {
        var newX = 0;
        var newY = 0;
        var movingAllowed;
        e = e || window.event;
        switch (e.keyCode) {
            case 38: // arrow up key
            case 87: // W key
                newY = -1;
                break;
            case 37: // arrow left key
            case 65: // A key
                newX = -1;
                break;
            case 40: // arrow down key
            case 83: // S key
                newY = 1;
                break;
            case 68: // D key
                break;
            case 39: // arrow right key
                newX = 1;
                break;
        }

        if (newX != 0 || newY != 0) {
            movePlayer(newX, newY);
            event.preventDefault();
        }
    }
})();
