var Player;
(function (Player) {
    Player[Player["BLACK"] = 0] = "BLACK";
    Player[Player["RED"] = 1] = "RED";
})(Player || (Player = {}));
// REVIEW: invoke as extensions/prototype?
var Utils = (function () {
    function Utils() {
    }
    Utils.removeAllChildren = function (element) {
        // fastest way to remove all child nodes: http://stackoverflow.com/a/3955238/487544
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    };
    return Utils;
})();
/// <reference path="Enums.ts"/>
/// <reference path="Utils.ts"/>
var CheckerContainerUI = (function () {
    function CheckerContainerUI(containerType, isTopSide) {
        this.containerDiv = document.createElement('div');
        var side = (isTopSide ? 'top' : 'bottom');
        this.containerDiv.className = "checker-container checker-container-" + side + " " + containerType;
    }
    CheckerContainerUI.prototype.setCheckers = function (player, count) {
        Utils.removeAllChildren(this.containerDiv);
        var $containerDiv = $(this.containerDiv);
        var className = Player[player].toLowerCase();
        for (var i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $containerDiv).text(count);
            }
            else if (i == 5) {
                $containerDiv.append($('<div class="checker checker-total">').addClass(className));
            }
            else {
                $containerDiv.append($('<div class="checker">').addClass(className));
            }
        }
    };
    CheckerContainerUI.prototype.highlightSource = function (on) {
        if (on) {
            $(this.containerDiv).addClass('highlight-source');
        }
        else {
            $(this.containerDiv).removeClass('highlight-source');
        }
    };
    return CheckerContainerUI;
})();
/// <reference path="CheckerContainerUI.ts"/>
/// <reference path="Enums.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BarUI = (function (_super) {
    __extends(BarUI, _super);
    function BarUI(player) {
        _super.call(this, 'bar', player === Player.RED);
        var self = this;
        this.containerDiv.onmouseover = function () { self.onInspected(true); };
        this.containerDiv.onmouseout = function () { self.onInspected(false); };
        this.containerDiv.onclick = function () {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
    }
    return BarUI;
})(CheckerContainerUI);
/// <reference path="Enums.ts"/>
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
/// <reference path="CheckerContainerUI.ts"/>
var PointUI = (function (_super) {
    __extends(PointUI, _super);
    function PointUI(colour, isTopSide) {
        _super.call(this, "point-" + colour, isTopSide);
        var self = this;
        this.containerDiv.onclick = function () {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
        this.containerDiv.onmouseover = function () { self.onInspected(true); };
        this.containerDiv.onmouseout = function () { self.onInspected(false); };
    }
    PointUI.prototype.highlightDestination = function (on) {
        if (on) {
            $(this.containerDiv).addClass('highlight-destination');
        }
        else {
            $(this.containerDiv).removeClass('highlight-destination');
        }
    };
    return PointUI;
})(CheckerContainerUI);
/// <reference path="CheckerContainer.ts"/>
/// <reference path="PointUI.ts"/>
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(pointUI, pointId, onInspected, onSelected) {
        _super.call(this, pointId);
        var self = this;
        this.pointId = pointId;
        this.pointUI = pointUI;
        this.pointUI.onInspected = function (on) { onInspected(self, on); };
        this.pointUI.onSelected = function (on) { onSelected(self, on); };
    }
    Point.prototype.decrement = function (player) {
        _super.prototype.decrement.call(this, player);
        this.pointUI.setCheckers(player, this.checkers[player]);
    };
    Point.prototype.increment = function (player, count) {
        _super.prototype.increment.call(this, player, count);
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
/// <reference path="Enums.ts"/>
/// <reference path="Point.ts"/>
var Bar = (function (_super) {
    __extends(Bar, _super);
    function Bar(blackBarUI, redBarUI, onInspected, onSelected) {
        _super.call(this, PointId.BAR);
        var self = this;
        blackBarUI.onInspected = function (on) { onInspected(self, on); };
        blackBarUI.onSelected = function (on) { onSelected(self, on); };
        redBarUI.onInspected = function (on) { onInspected(self, on); };
        redBarUI.onSelected = function (on) { onSelected(self, on); };
        this.barUIs = new Array(2);
        this.barUIs[Player.BLACK] = blackBarUI;
        this.barUIs[Player.RED] = redBarUI;
    }
    Bar.prototype.decrement = function (player) {
        _super.prototype.decrement.call(this, player);
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    };
    Bar.prototype.increment = function (player, count) {
        _super.prototype.increment.call(this, player, count);
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    };
    Bar.prototype.highlightSource = function (player, on) {
        this.barUIs[player].highlightSource(on);
    };
    return Bar;
})(CheckerContainer);
/// <reference path="CheckerContainerUI.ts"/>
var HomeUI = (function (_super) {
    __extends(HomeUI, _super);
    function HomeUI(player) {
        _super.call(this, 'home', player === Player.BLACK);
    }
    return HomeUI;
})(CheckerContainerUI);
/// <reference path="BarUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="HomeUI.ts"/>
/// <reference path="PointUI.ts"/>
/// <reference path="Utils.ts"/>
var BoardUI = (function () {
    function BoardUI() {
        this.containerDiv = document.createElement('div');
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.className = 'board';
        this.blackHomeUI = new HomeUI(Player.BLACK);
        this.redHomeUI = new HomeUI(Player.RED);
        this.pointUIs = new Array(24);
        for (var i = 0; i < this.pointUIs.length; i++) {
            var colour = (i % 2 == 0) ? 'black' : 'red';
            var isTopSide = i >= 12;
            this.pointUIs[i] = new PointUI(colour, isTopSide);
        }
        this.blackBarUI = new BarUI(Player.BLACK);
        this.redBarUI = new BarUI(Player.RED);
        // append all elements in the correct order
        this.containerDiv.appendChild(this.pointUIs[12].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[13].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[14].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[15].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[16].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[17].containerDiv);
        this.containerDiv.appendChild(this.redBarUI.containerDiv);
        this.containerDiv.appendChild(this.pointUIs[18].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[19].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[20].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[21].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[22].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[23].containerDiv);
        this.containerDiv.appendChild(this.blackHomeUI.containerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
        this.containerDiv.appendChild(this.pointUIs[11].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[10].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[9].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[8].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[7].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[6].containerDiv);
        this.containerDiv.appendChild(this.blackBarUI.containerDiv);
        this.containerDiv.appendChild(this.pointUIs[5].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[4].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[3].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[2].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[1].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[0].containerDiv);
        this.containerDiv.appendChild(this.redHomeUI.containerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
    }
    BoardUI.createClearBreak = function () {
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    };
    return BoardUI;
})();
/// <reference path="CheckerContainer.ts"/>
/// <reference path="HomeUI.ts"/>
var Home = (function (_super) {
    __extends(Home, _super);
    function Home(blackHomeUI, redHomeUI) {
        _super.call(this, PointId.HOME);
        this.homeUIs = new Array(2);
        this.homeUIs[Player.BLACK] = blackHomeUI;
        this.homeUIs[Player.RED] = redHomeUI;
    }
    Home.prototype.increment = function (player) {
        _super.prototype.increment.call(this, player, 1);
        this.homeUIs[player].setCheckers(player, this.checkers[player]);
    };
    return Home;
})(CheckerContainer);
/// <reference path="Bar.ts"/>
/// <reference path="BoardUI.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Home.ts"/>
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
        this.checkerContainers[PointId.HOME] = new Home(this.boardUI.blackHomeUI, this.boardUI.redHomeUI);
        for (var i = 1; i < 25; i++) {
            this.checkerContainers[i] = new Point(this.boardUI.pointUIs[i - 1], i, onPointInspected, onPointSelected);
        }
        this.checkerContainers[PointId.BAR] = new Bar(this.boardUI.blackBarUI, this.boardUI.redBarUI, onPointInspected, onPointSelected);
        this.increment(Player.RED, 24, 2);
        this.increment(Player.BLACK, 1, 2);
        this.increment(Player.RED, 6, 5);
        this.increment(Player.BLACK, 19, 5);
        this.increment(Player.RED, 8, 3);
        this.increment(Player.BLACK, 17, 3);
        this.increment(Player.RED, 13, 5);
        this.increment(Player.BLACK, 12, 5);
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
            return true;
        }
        return false;
    };
    Board.prototype.removeAllHighlights = function () {
        for (var pointId = 1; pointId <= 24; pointId++) {
            this.checkerContainers[pointId].highlightDestination(false);
            this.checkerContainers[pointId].highlightSource(false);
        }
    };
    return Board;
})();
var Die = (function () {
    function Die() {
        this.value = Math.floor(Math.random() * 6) + 1;
        this.remainingUses = 1;
    }
    Die.prototype.decrementRemainingUses = function () {
        this.remainingUses--;
        if (this.onChange) {
            this.onChange(this);
        }
    };
    return Die;
})();
/// <reference path="Die.ts" />
/// <reference path="Enums.ts"/>
var DiceUI = (function () {
    function DiceUI(player) {
        this.containerDiv = document.createElement('div');
        this.containerDiv.className = "dice-container dice-container-" + Player[player];
    }
    DiceUI.prototype.setDiceRolls = function (die1, die2) {
        var _this = this;
        this.die1 = die1;
        this.die1.onChange = function () { _this.redraw(); };
        this.die2 = die2;
        this.die2.onChange = function () { _this.redraw(); };
        this.redraw();
    };
    DiceUI.prototype.setActive = function (active) {
        if (active) {
            $(this.containerDiv).addClass('active');
        }
        else {
            $(this.containerDiv).removeClass('active');
        }
    };
    DiceUI.prototype.redraw = function () {
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.appendChild(DiceUI.createDie(this.die1));
        this.containerDiv.appendChild(DiceUI.createDie(this.die2));
    };
    DiceUI.createDie = function (die) {
        var div = document.createElement('div');
        div.className = 'die die-uses-' + die.remainingUses;
        div.innerText = die.value.toString();
        return div;
    };
    return DiceUI;
})();
/// <reference path="Die.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>
var Dice = (function () {
    function Dice(blackDiceUI, redDiceUI) {
        this.diceUIs = new Array();
        this.diceUIs[Player.BLACK] = blackDiceUI;
        this.diceUIs[Player.RED] = redDiceUI;
    }
    Dice.generateDie = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    Dice.prototype.roll = function (player) {
        this.die1 = new Die();
        this.die2 = new Die();
        var isDouble = (this.die1.value === this.die2.value);
        if (isDouble) {
            this.die1.remainingUses = 2;
            this.die2.remainingUses = 2;
        }
        this.diceUIs[player].setDiceRolls(this.die1, this.die2);
        this.diceUIs[player].setActive(true);
        var otherPlayer = player === Player.BLACK ? Player.RED : Player.BLACK;
        this.diceUIs[otherPlayer].setActive(false);
    };
    return Dice;
})();
var StatusUI = (function () {
    function StatusUI() {
        this.containerDiv = document.createElement('div');
        this.containerDiv.className = 'status-container';
    }
    StatusUI.prototype.setStatus = function (s) {
        var statusP = document.createElement('p');
        statusP.innerText = s;
        this.containerDiv.appendChild(statusP);
        this.containerDiv.scrollTop = this.containerDiv.scrollHeight;
    };
    return StatusUI;
})();
/// <reference path="BoardUI.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="StatusUI.ts"/>
/// <reference path="Utils.ts"/>
var GameUI = (function () {
    function GameUI(containerElementId) {
        var container = document.getElementById(containerElementId);
        container.className = 'game-container';
        Utils.removeAllChildren(container);
        this.boardUI = new BoardUI();
        this.blackDiceUI = new DiceUI(Player.BLACK);
        this.redDiceUI = new DiceUI(Player.RED);
        this.statusUI = new StatusUI();
        container.appendChild(this.boardUI.containerDiv);
        var sideContainer = document.createElement('div');
        sideContainer.appendChild(this.blackDiceUI.containerDiv);
        sideContainer.appendChild(this.statusUI.containerDiv);
        sideContainer.appendChild(this.redDiceUI.containerDiv);
        container.appendChild(sideContainer);
    }
    return GameUI;
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
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>
var Game = (function () {
    function Game(containerId) {
        var _this = this;
        var self = this;
        var ui = new GameUI(containerId);
        this.dice = new Dice(ui.blackDiceUI, ui.redDiceUI);
        this.board = new Board(ui.boardUI);
        this.board.onPointInspected = function (checkerContainer, on) {
            if (self.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }
            if (!on) {
                // turn off highlights if any
                if (checkerContainer instanceof Point) {
                    checkerContainer.highlightSource(false);
                }
                else if (checkerContainer instanceof Bar) {
                    checkerContainer.highlightSource(Player.BLACK, false);
                    checkerContainer.highlightSource(Player.RED, false);
                }
                self.board.removeAllHighlights();
            }
            else if (checkerContainer.checkers[self.currentPlayer] > 0) {
                var validMoveExists = false;
                if (self.dice.die1.remainingUses > 0) {
                    if (self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die1.value)) {
                        validMoveExists = true;
                    }
                }
                if (self.dice.die2.remainingUses > 0) {
                    if (self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die2.value)) {
                        validMoveExists = true;
                    }
                }
                if (validMoveExists) {
                    if (checkerContainer instanceof Point) {
                        checkerContainer.highlightSource(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        checkerContainer.highlightSource(_this.currentPlayer, true);
                    }
                }
            }
        };
        this.board.onPointSelected = function (point, on) {
            if (self.currentSelectedCheckerContainer == undefined) {
                if (point.checkers[self.currentPlayer] == 0) {
                    // if no pieces here, exit
                    return;
                }
                var canUseDie = function (die) {
                    return (die.remainingUses > 0 &&
                        self.board.isLegalMove(self.currentPlayer, point.pointId, die.value));
                };
                var canUseDie1 = canUseDie(self.dice.die1);
                var canUseDie2 = canUseDie(self.dice.die2);
                // if can use one die but not the other, or if it's doubles, just play it
                if ((canUseDie1 != canUseDie2) || (self.dice.die1.value === self.dice.die2.value)) {
                    if (canUseDie1) {
                        self.board.move(self.currentPlayer, point.pointId, self.dice.die1.value);
                        self.dice.die1.decrementRemainingUses();
                    }
                    else if (canUseDie2) {
                        self.board.move(self.currentPlayer, point.pointId, self.dice.die2.value);
                        self.dice.die2.decrementRemainingUses();
                    }
                    self.switchPlayerIfNoValidMovesRemain();
                    // reinspect point
                    _this.board.onPointInspected(point, false);
                    _this.board.onPointInspected(point, true);
                }
                else {
                    _this.currentSelectedCheckerContainer = point;
                }
            }
            else if (point.pointId === _this.currentSelectedCheckerContainer.pointId) {
                _this.currentSelectedCheckerContainer = undefined;
                // reinspect point
                _this.board.onPointInspected(point, false);
                _this.board.onPointInspected(point, true);
            }
            else {
                var isUsingDie = function (die) {
                    return (Board.getDestinationPointId(_this.currentPlayer, _this.currentSelectedCheckerContainer.pointId, die.value) === point.pointId);
                };
                if (isUsingDie(self.dice.die1)) {
                    self.board.move(self.currentPlayer, _this.currentSelectedCheckerContainer.pointId, self.dice.die1.value);
                    self.dice.die1.decrementRemainingUses();
                    _this.currentSelectedCheckerContainer = undefined;
                }
                else if (isUsingDie(self.dice.die2)) {
                    self.board.move(self.currentPlayer, _this.currentSelectedCheckerContainer.pointId, self.dice.die2.value);
                    self.dice.die2.decrementRemainingUses();
                    _this.currentSelectedCheckerContainer = undefined;
                }
                self.switchPlayerIfNoValidMovesRemain();
                // reinspect point
                _this.board.onPointInspected(point, false);
                _this.board.onPointInspected(point, true);
            }
        };
        this.statusLogger = new StatusLogger(ui.statusUI);
        // TODO: roll to see who starts. Assume BLACK.
        this.currentPlayer = Player.BLACK;
        this.logCurrentPlayer();
        this.dice.roll(this.currentPlayer);
    }
    Game.prototype.checkIfValidMovesRemain = function () {
        var _this = this;
        if (this.dice.die1.remainingUses == 0 && this.dice.die2.remainingUses == 0) {
            return false;
        }
        var isValidMove = function (die, pointId) {
            return (die.remainingUses > 0) && _this.board.isLegalMove(_this.currentPlayer, pointId, die.value);
        };
        for (var pointId = 1; pointId <= 25; pointId++) {
            if (isValidMove(this.dice.die1, pointId) || isValidMove(this.dice.die2, pointId)) {
                return true;
            }
        }
        this.statusLogger.logInfo('No valid moves remain!');
        return false;
    };
    Game.prototype.switchPlayerIfNoValidMovesRemain = function () {
        if (!this.checkIfValidMovesRemain()) {
            // if we're still here, 
            this.switchPlayer();
            this.dice.roll(this.currentPlayer);
            this.switchPlayerIfNoValidMovesRemain();
        }
    };
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
