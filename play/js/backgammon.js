var PointUI = (function () {
    function PointUI(pointId) {
        this.pointDiv = document.createElement('div');
        this.pointDiv.id = 'point' + pointId.toString();
        var side = (pointId < 13 ? 'bottom' : 'top');
        var colour = (pointId % 2 == 0) ? 'black' : 'red';
        this.pointDiv.className = "point " + side + "-point " + colour + "-point";
    }
    PointUI.prototype.clearCheckers = function () {
        for (var i = 0; i < this.pointDiv.childNodes.length; i++) {
            this.pointDiv.removeChild(this.pointDiv.childNodes[i]);
        }
    };
    PointUI.prototype.setCheckers = function (player, count) {
        this.clearCheckers();
        var $pointDiv = $(this.pointDiv);
        for (var i = 1; i <= count; i++) {
            if (i > 5) {
                $('.counter-total', $pointDiv).text(count);
            }
            else if (i == 5) {
                $pointDiv.append($('<div class="counter counter-total">').addClass(Player[player]));
            }
            else {
                $pointDiv.append($('<div class="counter">').addClass(Player[player]));
            }
        }
    };
    return PointUI;
})();
/// <reference path="PointUI.ts"/>
var Point = (function () {
    function Point(pointId) {
        this.pointId = pointId;
        this.checkers = [0, 0];
        this.pointUI = new PointUI(pointId);
    }
    Point.prototype.increment = function (player, count) {
        this.checkers[player] += count;
        this.pointUI.setCheckers(player, this.checkers[player]);
    };
    return Point;
})();
/// <reference path="Point.ts"/>
var BoardData = (function () {
    function BoardData() {
        this.data = new Array(26);
        for (var i = 0; i < 26; i++) {
            this.data[i] = new Point(i);
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
    BoardData.prototype.increment = function (pointId, player, count) {
        this.data[pointId].increment(player, count || 1);
    };
    return BoardData;
})();
/// <reference path="PointUI.ts"/>
var BoardUI = (function () {
    function BoardUI(boardElementId) {
        this.boardDiv = document.getElementById(boardElementId);
        // TODO: check board element is empty
        this.boardDiv.className = 'board';
    }
    BoardUI.prototype.initialise = function (boardData) {
        this.boardDiv.appendChild(boardData.data[13].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[14].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[15].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[16].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[17].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[18].pointUI.pointDiv);
        this.boardDiv.appendChild(BoardUI.createBar(Player.BLACK));
        this.boardDiv.appendChild(boardData.data[19].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[20].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[21].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[22].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[23].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[24].pointUI.pointDiv);
        this.boardDiv.appendChild(BoardUI.createHome(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild(boardData.data[12].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[11].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[10].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[9].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[8].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[7].pointUI.pointDiv);
        this.boardDiv.appendChild(BoardUI.createBar(Player.RED));
        this.boardDiv.appendChild(boardData.data[6].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[5].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[4].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[3].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[2].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[1].pointUI.pointDiv);
        this.boardDiv.appendChild(BoardUI.createHome(Player.RED));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
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
    return BoardUI;
})();
/// <reference path="BoardData.ts"/>
/// <reference path="BoardUI.ts"/>
var Board = (function () {
    function Board(boardUI) {
        this.boardData = new BoardData();
        this.boardUI = boardUI;
        this.boardUI.initialise(this.boardData);
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
