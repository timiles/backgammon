var BoardData = (function () {
    function BoardData() {
        this.data = new Array(26);
        for (var i = 0; i < 26; i++) {
            this.data[i] = [0, 0];
        }
        this.increment(24, Player.RED, 2);
        this.increment(1, Player.BLACK, 2);
        this.increment(6, Player.RED, 5);
        this.increment(19, Player.BLACK, 5);
        this.increment(8, Player.RED, 3);
        this.increment(17, Player.BLACK, 3);
        this.increment(13, Player.RED, 5);
        this.increment(12, Player.BLACK, 5);
    }
    BoardData.getPipIndex = function (pipNumber, player) {
        // special pips:
        if ((pipNumber == 0) || (pipNumber == 25)) {
            return pipNumber;
        }
        // otherwise invert board if we are black
        return player == Player.RED ? pipNumber : 25 - pipNumber;
    };
    BoardData.prototype.increment = function (pipNumber, player, count) {
        return (this.data[BoardData.getPipIndex(pipNumber, player)][player] += (count || 1));
    };
    BoardData.prototype.decrement = function (pipNumber, player) {
        return --this.data[BoardData.getPipIndex(pipNumber, player)][player];
    };
    BoardData.prototype.getCounters = function (pipNumber, player) {
        return this.data[BoardData.getPipIndex(pipNumber, player)][player];
    };
    return BoardData;
})();
var Side;
(function (Side) {
    Side[Side["TOP"] = 0] = "TOP";
    Side[Side["BOTTOM"] = 1] = "BOTTOM";
})(Side || (Side = {}));
var PointUI = (function () {
    function PointUI(pointId, side) {
        this.pointDiv = document.createElement('div');
        this.pointDiv.id = 'point' + pointId.toString();
        var colour = (pointId % 2 == 0) ? 'black' : 'red';
        this.pointDiv.className = "point " + Side[side] + "-point " + colour + "-point";
    }
    return PointUI;
})();
/// <reference path="PointUI.ts"/>
var BoardUI = (function () {
    function BoardUI(boardElementId) {
        this.boardDiv = document.getElementById(boardElementId);
        // TODO: check board element is empty
        this.boardDiv.className = 'board';
        this.boardDiv.appendChild(BoardUI.createPip(13, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(14, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(15, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(16, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(17, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(18, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createBar(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(19, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(20, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(21, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(22, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(23, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(24, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createHome(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild(BoardUI.createPip(12, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(11, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(10, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(9, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(8, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(7, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createBar(Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(6, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(5, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(4, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(3, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(2, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(1, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createHome(Player.RED));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
    }
    BoardUI.createPip = function (pipNumber, side) {
        var point = new PointUI(pipNumber, side);
        return point.pointDiv;
    };
    BoardUI.createBar = function (player) {
        var bar = document.createElement('div');
        bar.id = Player[player] + '-bar';
        bar.className = 'point bar';
        return bar;
    };
    BoardUI.createHome = function (player) {
        var bar = document.createElement('div');
        bar.id = Player[player] + '-home';
        bar.className = 'point home';
        return bar;
    };
    BoardUI.createClearBreak = function () {
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    };
    BoardUI.prototype.getPipDiv = function (pipNumber, player) {
        switch (pipNumber) {
            case 0: {
                return document.getElementById(Player[player] + '-home');
            }
            case 25: {
                return document.getElementById(Player[player] + '-bar');
            }
            default: {
                return document.getElementById('point' + pipNumber.toString());
            }
        }
    };
    BoardUI.prototype.setPipCounters = function (pipNumber, numberOfCounters, player) {
        var $pipDiv = $(this.getPipDiv(pipNumber, player));
        for (var i = 1; i <= numberOfCounters; i++) {
            if (i > 5) {
                $('.counter-total', $pipDiv).text(numberOfCounters);
            }
            else if (i == 5) {
                $pipDiv.append($('<div class="counter counter-total">').addClass(Player[player]));
            }
            else {
                $pipDiv.append($('<div class="counter">').addClass(Player[player]));
            }
        }
    };
    BoardUI.prototype.draw = function (boardData) {
        for (var i = 0; i < 26; i++) {
            this.setPipCounters(i, boardData.getCounters(i, Player.BLACK), Player.BLACK);
            this.setPipCounters(i, boardData.getCounters(i, Player.RED), Player.RED);
        }
    };
    return BoardUI;
})();
/// <reference path="BoardData.ts"/>
/// <reference path="BoardUI.ts"/>
var Board = (function () {
    function Board(boardUI) {
        this.boardData = new BoardData();
        this.boardUI = boardUI;
        this.boardUI.draw(this.boardData);
    }
    return Board;
})();
var DiceUI = (function () {
    function DiceUI(diceContainerElementId) {
        this.diceContainerDiv = document.getElementById(diceContainerElementId);
    }
    DiceUI.prototype.setDiceRolls = function (roll1, roll2) {
        this.diceContainerDiv.innerText = roll1 + ", " + roll2;
    };
    return DiceUI;
})();
/// <reference path="DiceUI.ts"/>
var Dice = (function () {
    function Dice(diceUI) {
        this.diceUI = diceUI;
    }
    Dice.generateDie = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    Dice.prototype.roll = function () {
        this.roll1 = Dice.generateDie();
        this.roll2 = Dice.generateDie();
        this.diceUI.setDiceRolls(this.roll1, this.roll2);
    };
    return Dice;
})();
var StatusUI = (function () {
    function StatusUI(statusSpanElementId) {
        this.statusSpan = document.getElementById(statusSpanElementId);
    }
    StatusUI.prototype.setStatus = function (s) {
        this.statusSpan.innerText = s;
    };
    return StatusUI;
})();
/// <reference path="StatusUI.ts"/>
var StatusLogger = (function () {
    function StatusLogger(statusUI) {
        this.statusUI = statusUI;
    }
    StatusLogger.prototype.logInfo = function (s) {
        this.statusUI.setStatus(s);
    };
    return StatusLogger;
})();
/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="StatusLogger.ts"/>
var Player;
(function (Player) {
    Player[Player["BLACK"] = 0] = "BLACK";
    Player[Player["RED"] = 1] = "RED";
})(Player || (Player = {}));
var Game = (function () {
    function Game(board, dice, statusLogger) {
        this.board = board;
        this.dice = dice;
        this.statusLogger = statusLogger;
        // TODO: roll to see who starts. Assume BLACK.
        this.statusLogger.logInfo('BLACK to move');
        this.dice.roll();
    }
    return Game;
})();
