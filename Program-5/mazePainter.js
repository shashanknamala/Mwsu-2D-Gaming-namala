(function(global) {
    "use strict";

    var jsmaze = global.jsmaze;
    if (!jsmaze) {
        jsmaze = {};
        global.jsmaze = jsmaze;
    }


    jsmaze.getStyle = function(maze, blockType) {
        switch (blockType) {
            case maze.WALL:
                return "#484848";
            case maze.PATH:
                return "#C0C0C0";
            case maze.BOARDER:
                return "#484848";
            case maze.ENTRANCE:
                return "#484848";
            case maze.EXIT:
                return "#00FF00";
            case maze.PLAYER:
                return "#FFFF00";
            case maze.TRACE:
                return "#FF00FF";
        }

        return "#FFFFFF";
    }

    jsmaze.drawMaze = function(maze) {
        for (var column = 0; column < maze.width; column++) {
            for (var row = 0; row < maze.height; row++) {
                jsmaze.drawBlock(maze, column, row, maze.cells[column][row]);
            }
        }
    }

    jsmaze.drawBlock = function(maze, x, y, blockType) {
        maze.canvasContext.beginPath();
        maze.canvasContext.rect(x * maze.PLAYER_SIZE, y * maze.PLAYER_SIZE, maze.PLAYER_SIZE, maze.PLAYER_SIZE);
        maze.canvasContext.closePath();
        maze.canvasContext.fillStyle = jsmaze.getStyle(maze, blockType);
        maze.canvasContext.fill();
    }
})(this);
