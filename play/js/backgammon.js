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
/// <reference path="Utils.ts"/>
var CheckerContainerUI = (function () {
    function CheckerContainerUI(containerType, isTopSide) {
        this.checkerContainerDiv = document.createElement('div');
        var side = (isTopSide ? 'top' : 'bottom');
        this.checkerContainerDiv.className = "checker-container checker-container-" + side + " " + containerType;
    }
    CheckerContainerUI.prototype.setCheckers = function (player, count) {
        Utils.removeAllChildren(this.checkerContainerDiv);
        var $checkerContainerDiv = $(this.checkerContainerDiv);
        var className = Player[player].toLowerCase();
        for (var i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $checkerContainerDiv).text(count);
            }
            else if (i == 5) {
                $checkerContainerDiv.append($('<div class="checker checker-total">').addClass(className));
            }
            else {
                $checkerContainerDiv.append($('<div class="checker">').addClass(className));
            }
        }
    };
    return CheckerContainerUI;
})();
/// <reference path="CheckerContainerUI.ts"/>
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
        this.checkerContainerDiv.onmouseover = function () { self.onInspected(true); };
        this.checkerContainerDiv.onmouseout = function () { self.onInspected(false); };
        this.checkerContainerDiv.onclick = function () {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
    }
    return BarUI;
})(CheckerContainerUI);
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
        this.checkerContainerDiv.onclick = function () {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
        this.checkerContainerDiv.onmouseover = function () { self.onInspected(true); };
        this.checkerContainerDiv.onmouseout = function () { self.onInspected(false); };
    }
    PointUI.prototype.highlightDestination = function (on) {
        if (on) {
            $(this.checkerContainerDiv).addClass('highlight-destination');
        }
        else {
            $(this.checkerContainerDiv).removeClass('highlight-destination');
        }
    };
    PointUI.prototype.highlightSource = function (on) {
        if (on) {
            $(this.checkerContainerDiv).addClass('highlight-source');
        }
        else {
            $(this.checkerContainerDiv).removeClass('highlight-source');
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
        this.containerDiv.appendChild(this.pointUIs[12].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[13].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[14].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[15].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[16].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[17].checkerContainerDiv);
        this.containerDiv.appendChild(this.redBarUI.checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[18].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[19].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[20].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[21].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[22].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[23].checkerContainerDiv);
        this.containerDiv.appendChild(this.blackHomeUI.checkerContainerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
        this.containerDiv.appendChild(this.pointUIs[11].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[10].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[9].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[8].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[7].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[6].checkerContainerDiv);
        this.containerDiv.appendChild(this.blackBarUI.checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[5].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[4].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[3].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[2].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[1].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[0].checkerContainerDiv);
        this.containerDiv.appendChild(this.redHomeUI.checkerContainerDiv);
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
    function DiceUI() {
        this.containerDiv = document.createElement('div');
    }
    DiceUI.prototype.setDiceRolls = function (roll1, roll2) {
        this.containerDiv.innerText = roll1 + ", " + roll2;
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
/// <reference path="Game.ts"/>
var PlayerIndicatorUI = (function () {
    function PlayerIndicatorUI() {
        this.indicators = new Array(2);
        this.indicators[Player.BLACK] = PlayerIndicatorUI.createIndicator(Player.BLACK);
        this.indicators[Player.RED] = PlayerIndicatorUI.createIndicator(Player.RED);
    }
    PlayerIndicatorUI.createIndicator = function (player) {
        var div = document.createElement('div');
        div.className = 'player-indicator checker ' + Player[player].toString().toLowerCase();
        return div;
    };
    PlayerIndicatorUI.prototype.setActivePlayer = function (player) {
        var otherPlayer = player === Player.BLACK ? Player.RED : Player.BLACK;
        $(this.indicators[otherPlayer]).removeClass('active');
        $(this.indicators[player]).addClass('active');
    };
    return PlayerIndicatorUI;
})();
var StatusUI = (function () {
    function StatusUI() {
        this.statusSpan = document.createElement('span');
    }
    StatusUI.prototype.setStatus = function (s) {
        this.statusSpan.innerText = s;
    };
    return StatusUI;
})();
/// <reference path="BoardUI.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="PlayerIndicatorUI.ts"/>
/// <reference path="StatusUI.ts"/>
/// <reference path="Utils.ts"/>
var GameUI = (function () {
    function GameUI(containerElementId) {
        var container = document.getElementById(containerElementId);
        Utils.removeAllChildren(container);
        this.boardUI = new BoardUI();
        this.diceUI = new DiceUI();
        this.playerIndicatorUI = new PlayerIndicatorUI();
        this.statusUI = new StatusUI();
        container.appendChild(this.boardUI.containerDiv);
        container.appendChild(this.diceUI.containerDiv);
        container.appendChild(this.statusUI.statusSpan);
        container.appendChild(this.playerIndicatorUI.indicators[Player.BLACK]);
        container.appendChild(this.playerIndicatorUI.indicators[Player.RED]);
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
/// <reference path="Dice.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="PlayerIndicatorUI.ts"/>
/// <reference path="StatusLogger.ts"/>
var Player;
(function (Player) {
    Player[Player["BLACK"] = 0] = "BLACK";
    Player[Player["RED"] = 1] = "RED";
})(Player || (Player = {}));
var Game = (function () {
    function Game(containerId) {
        var self = this;
        var ui = new GameUI(containerId);
        this.dice = new Dice(ui.diceUI);
        this.board = new Board(ui.boardUI);
        this.playerIndicatorUI = ui.playerIndicatorUI;
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
        this.statusLogger = new StatusLogger(ui.statusUI);
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
        this.playerIndicatorUI.setActivePlayer(this.currentPlayer);
    };
    return Game;
})();
