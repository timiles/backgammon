var BarUI = (function () {
    function BarUI(player, onInspected, onSelected) {
        var self = this;
        this.barDiv = document.createElement('div');
        var side = (player === Player.BLACK ? 'bottom' : 'top');
        this.barDiv.id = Player[player] + '-bar';
        this.barDiv.className = "point " + side + "-point bar";
        this.barDiv.onmouseover = function () { onInspected(true); };
        this.barDiv.onmouseout = function () { onInspected(false); };
        this.barDiv.onclick = function () {
            self.isSelected = !self.isSelected;
            onSelected(self.isSelected);
        };
    }
    BarUI.prototype.clearCheckers = function () {
        while (this.barDiv.hasChildNodes()) {
            this.barDiv.removeChild(this.barDiv.childNodes[0]);
        }
    };
    BarUI.prototype.setCheckers = function (player, count) {
        this.clearCheckers();
        var $barDiv = $(this.barDiv);
        var className = Player[player].toLowerCase();
        for (var i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $barDiv).text(count);
            }
            else if (i == 5) {
                $barDiv.append($('<div class="checker checker-total">').addClass(className));
            }
            else {
                $barDiv.append($('<div class="checker">').addClass(className));
            }
        }
    };
    return BarUI;
})();
var CheckerContainer = (function () {
    function CheckerContainer(pointId) {
        this.pointId = pointId;
        this.checkers = [0, 0];
    }
    CheckerContainer.prototype.decrement = function (player) {
        this.checkers[player]--;
    };
    CheckerContainer.prototype.increment = function (player, count) {
        this.checkers[player] += count;
    };
    return CheckerContainer;
})();
var PointUI = (function () {
    function PointUI(pointId, onInspected, onSelected) {
        var self = this;
        this.pointDiv = document.createElement('div');
        var side = (pointId < 13 ? 'bottom' : 'top');
        var colour = (pointId % 2 == 0) ? 'black' : 'red';
        this.pointDiv.className = "point " + side + "-point " + colour + "-point";
        this.pointDiv.onmouseover = function () { onInspected(true); };
        this.pointDiv.onmouseout = function () { onInspected(false); };
        this.pointDiv.onclick = function () {
            self.isSelected = !self.isSelected;
            onSelected(self.isSelected);
        };
    }
    PointUI.prototype.clearCheckers = function () {
        while (this.pointDiv.hasChildNodes()) {
            this.pointDiv.removeChild(this.pointDiv.childNodes[0]);
        }
    };
    PointUI.prototype.setCheckers = function (player, count) {
        this.clearCheckers();
        var $pointDiv = $(this.pointDiv);
        var className = Player[player].toLowerCase();
        for (var i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $pointDiv).text(count);
            }
            else if (i == 5) {
                $pointDiv.append($('<div class="checker checker-total">').addClass(className));
            }
            else {
                $pointDiv.append($('<div class="checker">').addClass(className));
            }
        }
    };
    PointUI.prototype.highlightDestination = function (on) {
        if (on) {
            $(this.pointDiv).addClass('highlight-destination');
        }
        else {
            $(this.pointDiv).removeClass('highlight-destination');
        }
    };
    PointUI.prototype.highlightSource = function (on) {
        if (on) {
            $(this.pointDiv).addClass('highlight-source');
        }
        else {
            $(this.pointDiv).removeClass('highlight-source');
        }
    };
    return PointUI;
})();
/// <reference path="CheckerContainer.ts"/>
/// <reference path="PointUI.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(pointId, onInspected, onSelected) {
        _super.call(this, pointId);
        var self = this;
        this.pointId = pointId;
        this.pointUI = new PointUI(pointId, function (on) { onInspected(self, on); }, function (on) { onSelected(self, on); });
    }
    Point.prototype.decrement = function (player) {
        _super.prototype.decrement.call(this, player);
        this.pointUI.setCheckers(player, this.checkers[player]);
    };
    Point.prototype.increment = function (player, count) {
        _super.prototype.increment.call(this, player, count);
        ;
        this.pointUI.setCheckers(player, this.checkers[player]);
    };
    Point.prototype.highlightDestination = function (on) {
        this.pointUI.highlightDestination(on);
    };
    Point.prototype.highlightSource = function (on) {
        this.pointUI.highlightSource(on);
    };
    return Point;
})(CheckerContainer);
/// <reference path="BarUI.ts"/>
/// <reference path="Point.ts"/>
var Bar = (function (_super) {
    __extends(Bar, _super);
    function Bar(onInspected, onSelected) {
        _super.call(this, PointId.BAR);
        var self = this;
        this.barUIs = new Array(2);
        this.barUIs[Player.BLACK] =
            new BarUI(Player.BLACK, function (on) { onInspected(self, on); }, function (on) { onSelected(self, on); });
        this.barUIs[Player.RED] =
            new BarUI(Player.RED, function (on) { onInspected(self, on); }, function (on) { onSelected(self, on); });
    }
    Bar.prototype.decrement = function (player) {
        _super.prototype.decrement.call(this, player);
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    };
    Bar.prototype.increment = function (player, count) {
        _super.prototype.increment.call(this, player, count);
        ;
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    };
    return Bar;
})(CheckerContainer);
var HomeUI = (function () {
    function HomeUI(player) {
        var self = this;
        this.homeDiv = document.createElement('div');
        var side = (player === Player.BLACK ? 'top' : 'bottom');
        this.homeDiv.id = Player[player] + '-home';
        this.homeDiv.className = "point " + side + "-point home";
    }
    HomeUI.prototype.clearCheckers = function () {
        while (this.homeDiv.hasChildNodes()) {
            this.homeDiv.removeChild(this.homeDiv.childNodes[0]);
        }
    };
    HomeUI.prototype.setCheckers = function (player, count) {
        this.clearCheckers();
        var $homeDiv = $(this.homeDiv);
        var className = Player[player].toLowerCase();
        for (var i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $homeDiv).text(count);
            }
            else if (i == 5) {
                $homeDiv.append($('<div class="checker checker-total">').addClass(className));
            }
            else {
                $homeDiv.append($('<div class="checker">').addClass(className));
            }
        }
    };
    return HomeUI;
})();
/// <reference path="CheckerContainer.ts"/>
/// <reference path="HomeUI.ts"/>
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        _super.call(this, PointId.BAR);
        this.homeUIs = new Array(2);
        this.homeUIs[Player.BLACK] = new HomeUI(Player.BLACK);
        this.homeUIs[Player.RED] = new HomeUI(Player.RED);
    }
    Home.prototype.increment = function (player) {
        _super.prototype.increment.call(this, player, 1);
        this.homeUIs[player].setCheckers(player, this.checkers[player]);
    };
    return Home;
})(CheckerContainer);
/// <reference path="Bar.ts"/>
/// <reference path="Home.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="PointUI.ts"/>
var BoardUI = (function () {
    function BoardUI(boardElementId) {
        this.boardDiv = document.getElementById(boardElementId);
        while (this.boardDiv.hasChildNodes()) {
            this.boardDiv.removeChild(this.boardDiv.childNodes[0]);
        }
        this.boardDiv.className = 'board';
    }
    BoardUI.prototype.initialise = function (checkerContainers) {
        this.boardDiv.appendChild(checkerContainers[13].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[14].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[15].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[16].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[17].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[18].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[PointId.BAR].barUIs[Player.RED].barDiv);
        this.boardDiv.appendChild(checkerContainers[19].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[20].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[21].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[22].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[23].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[24].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[PointId.HOME].homeUIs[Player.BLACK].homeDiv);
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild(checkerContainers[12].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[11].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[10].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[9].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[8].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[7].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[PointId.BAR].barUIs[Player.BLACK].barDiv);
        this.boardDiv.appendChild(checkerContainers[6].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[5].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[4].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[3].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[2].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[1].pointUI.pointDiv);
        this.boardDiv.appendChild(checkerContainers[PointId.HOME].homeUIs[Player.RED].homeDiv);
        this.boardDiv.appendChild(BoardUI.createClearBreak());
    };
    BoardUI.createClearBreak = function () {
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    };
    return BoardUI;
})();
/// <reference path="Bar.ts"/>
/// <reference path="BoardUI.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Point.ts"/>
var PointId;
(function (PointId) {
    PointId[PointId["HOME"] = 0] = "HOME";
    PointId[PointId["BAR"] = 25] = "BAR";
})(PointId || (PointId = {}));
var Board = (function () {
    function Board(boardUI) {
        var _this = this;
        this.boardUI = boardUI;
        var onPointInspected = function (checkerContainer, on) {
            if (_this.onPointInspected) {
                _this.onPointInspected(checkerContainer, on);
            }
        };
        var onPointSelected = function (checkerContainer, on) {
            if (_this.onPointSelected) {
                _this.onPointSelected(checkerContainer, on);
            }
        };
        this.checkerContainers = new Array(26);
        this.checkerContainers[PointId.HOME] = new Home();
        for (var i = 1; i < 25; i++) {
            this.checkerContainers[i] = new Point(i, onPointInspected, onPointSelected);
        }
        this.checkerContainers[PointId.BAR] = new Bar(onPointInspected, onPointSelected);
        this.increment(Player.RED, 24, 2);
        this.increment(Player.BLACK, 1, 2);
        this.increment(Player.RED, 6, 5);
        this.increment(Player.BLACK, 19, 5);
        this.increment(Player.RED, 8, 3);
        this.increment(Player.BLACK, 17, 3);
        this.increment(Player.RED, 13, 5);
        this.increment(Player.BLACK, 12, 5);
        this.boardUI.initialise(this.checkerContainers);
    }
    Board.prototype.decrement = function (player, pointId) {
        this.checkerContainers[pointId].decrement(player);
    };
    Board.prototype.increment = function (player, pointId, count) {
        this.checkerContainers[pointId].increment(player, count || 1);
    };
    Board.getDestinationPointId = function (player, sourcePointId, numberOfMoves) {
        if (sourcePointId === PointId.BAR) {
            if (player === Player.BLACK) {
                return numberOfMoves;
            }
            else {
                return 25 - numberOfMoves;
            }
        }
        var direction = player == Player.BLACK ? 1 : -1;
        var destinationPointId = sourcePointId + (direction * numberOfMoves);
        if (destinationPointId > 24 || destinationPointId < 0)
            return 0; // when bearing off to home
        return destinationPointId;
    };
    Board.prototype.isLegalMove = function (player, sourcePointId, numberOfMoves) {
        // case: there is no counter to move: fail
        if (this.checkerContainers[sourcePointId].checkers[player] == 0) {
            console.info('no counter at ' + sourcePointId);
            return false;
        }
        // case: there is a counter on the bar, and this is not it
        if ((sourcePointId != PointId.BAR) && (this.checkerContainers[PointId.BAR].checkers[player] > 0)) {
            console.info('must move counter off bar first');
            return false;
        }
        // case: bearing off
        var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        if (destinationPointId == 0) {
            // check that there are no pieces outside of home board. (BAR has already been checked above)
            var pointIdOutsideOfHomeBoard = (player === Player.BLACK) ? 1 : 7;
            var totalPointsOutsideOfHomeBoard = 18;
            for (var offset = 0; offset < totalPointsOutsideOfHomeBoard; offset++) {
                if (this.checkerContainers[pointIdOutsideOfHomeBoard + offset].checkers[player] > 0) {
                    return false;
                }
            }
            return true;
        }
        var otherPlayer = Game.getOtherPlayer(player);
        // case: there is a counter, but opponent blocks the end pip
        if (this.checkerContainers[destinationPointId].checkers[otherPlayer] >= 2) {
            console.info('point is blocked');
            return false;
        }
        return true;
    };
    Board.prototype.move = function (player, sourcePointId, numberOfMoves) {
        if (!this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            return false;
        }
        var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        var otherPlayer = Game.getOtherPlayer(player);
        if (this.checkerContainers[destinationPointId].checkers[otherPlayer] == 1) {
            this.decrement(otherPlayer, destinationPointId);
            this.increment(otherPlayer, PointId.BAR);
        }
        this.decrement(player, sourcePointId);
        this.increment(player, destinationPointId);
        return true;
    };
    Board.prototype.highlightIfLegalMove = function (player, sourcePointId, numberOfMoves) {
        if (this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
            this.checkerContainers[destinationPointId].highlightDestination(true);
        }
    };
    Board.prototype.removeAllHighlights = function () {
        for (var pointId = 1; pointId <= 24; pointId++) {
            this.checkerContainers[pointId].highlightDestination(false);
        }
    };
    return Board;
})();
var Die = (function () {
    function Die() {
        this.value = Math.floor(Math.random() * 6) + 1;
        this.remainingUses = 1;
    }
    return Die;
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
/// <reference path="Die.ts"/>
/// <reference path="DiceUI.ts"/>
var Dice = (function () {
    function Dice(diceUI) {
        this.diceUI = diceUI;
    }
    Dice.generateDie = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    Dice.prototype.roll = function () {
        this.die1 = new Die();
        this.die2 = new Die();
        var isDouble = (this.die1.value === this.die2.value);
        if (isDouble) {
            this.die1.remainingUses = 2;
            this.die2.remainingUses = 2;
        }
        this.diceUI.setDiceRolls(this.die1.value, this.die2.value);
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
    function Game(boardElementId, diceElementId, statusElementId) {
        var self = this;
        this.dice = new Dice(new DiceUI(diceElementId));
        this.board = new Board(new BoardUI(boardElementId));
        this.board.onPointInspected = function (checkerContainer, on) {
            if (!on) {
                // turn off highlights if any
                if (checkerContainer instanceof Point) {
                    checkerContainer.highlightSource(false);
                }
                self.board.removeAllHighlights();
            }
            else if (checkerContainer.checkers[self.currentPlayer] > 0) {
                if (checkerContainer instanceof Point) {
                    checkerContainer.highlightSource(true);
                }
                if (self.dice.die1.remainingUses > 0) {
                    self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die1.value);
                }
                if (self.dice.die2.remainingUses > 0) {
                    self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die2.value);
                }
            }
        };
        this.board.onPointSelected = function (point, on) {
            if (point.checkers[self.currentPlayer] > 0) {
                if (self.dice.die1.remainingUses > 0 &&
                    self.board.isLegalMove(self.currentPlayer, point.pointId, self.dice.die1.value)) {
                    self.board.move(self.currentPlayer, point.pointId, self.dice.die1.value);
                    self.dice.die1.remainingUses--;
                }
                else if (self.dice.die2.remainingUses > 0 &&
                    self.board.isLegalMove(self.currentPlayer, point.pointId, self.dice.die2.value)) {
                    self.board.move(self.currentPlayer, point.pointId, self.dice.die2.value);
                    self.dice.die2.remainingUses--;
                }
            }
            if (self.dice.die1.remainingUses == 0 && self.dice.die2.remainingUses == 0) {
                self.switchPlayer();
                self.dice.roll();
            }
        };
        this.statusLogger = new StatusLogger(new StatusUI(statusElementId));
        // TODO: roll to see who starts. Assume BLACK.
        this.currentPlayer = Player.BLACK;
        this.logCurrentPlayer();
        this.dice.roll();
    }
    Game.getOtherPlayer = function (player) {
        return player === Player.BLACK ? Player.RED : Player.BLACK;
    };
    Game.prototype.switchPlayer = function () {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.logCurrentPlayer();
    };
    Game.prototype.logCurrentPlayer = function () {
        this.statusLogger.logInfo(Player[this.currentPlayer] + " to move");
    };
    return Game;
})();
