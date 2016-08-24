var PlayerId;
(function (PlayerId) {
    PlayerId[PlayerId["BLACK"] = 0] = "BLACK";
    PlayerId[PlayerId["RED"] = 1] = "RED";
})(PlayerId || (PlayerId = {}));
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
    Utils.highlight = function (el) {
        $(el).addClass('highlight');
        // timeout purely to allow ui to update
        setTimeout(function () {
            $(el).addClass('highlight-end');
        }, 0);
    };
    return Utils;
})();
/// <reference path="Enums.ts"/>
/// <reference path="Utils.ts"/>
var CheckerContainerUI = (function () {
    function CheckerContainerUI(containerType, isTopSide) {
        var _this = this;
        this.containerDiv = document.createElement('div');
        var side = (isTopSide ? 'top' : 'bottom');
        this.containerDiv.className = "checker-container checker-container-" + side + " " + containerType;
        this.containerDiv.onclick = function () { _this.onSelected(); };
    }
    CheckerContainerUI.prototype.setCheckers = function (player, count) {
        Utils.removeAllChildren(this.containerDiv);
        var $containerDiv = $(this.containerDiv);
        var className = PlayerId[player].toLowerCase();
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
    CheckerContainerUI.prototype.setSelected = function (on) {
        $(this.containerDiv).toggleClass('selected', on);
    };
    CheckerContainerUI.prototype.setValidSource = function (on) {
        $(this.containerDiv).toggleClass('valid-source', on);
    };
    CheckerContainerUI.prototype.setValidDestination = function (on) {
        $(this.containerDiv).toggleClass('valid-destination', on);
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
        var _this = this;
        _super.call(this, 'bar', player === PlayerId.RED);
        this.containerDiv.onmouseover = function () { _this.onInspected(true); };
        this.containerDiv.onmouseout = function () { _this.onInspected(false); };
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
        var _this = this;
        _super.call(this, "point-" + colour, isTopSide);
        this.containerDiv.onmouseover = function () { _this.onInspected(true); };
        this.containerDiv.onmouseout = function () { _this.onInspected(false); };
    }
    return PointUI;
})(CheckerContainerUI);
/// <reference path="CheckerContainer.ts"/>
/// <reference path="PointUI.ts"/>
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(pointUI, pointId, onInspected, onSelected) {
        var _this = this;
        _super.call(this, pointId);
        this.pointId = pointId;
        this.pointUI = pointUI;
        this.pointUI.onInspected = function (on) { onInspected(_this, on); };
        this.pointUI.onSelected = function () { onSelected(_this); };
    }
    Point.prototype.decrement = function (player) {
        _super.prototype.decrement.call(this, player);
        this.pointUI.setCheckers(player, this.checkers[player]);
    };
    Point.prototype.increment = function (player, count) {
        _super.prototype.increment.call(this, player, count);
        this.pointUI.setCheckers(player, this.checkers[player]);
    };
    Point.prototype.setValidDestination = function (on) {
        this.pointUI.setValidDestination(on);
    };
    Point.prototype.setValidSource = function (on) {
        this.pointUI.setValidSource(on);
    };
    Point.prototype.setSelected = function (on) {
        this.pointUI.setSelected(on);
    };
    return Point;
})(CheckerContainer);
/// <reference path="BarUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Point.ts"/>
var Bar = (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        _super.call(this, PointId.BAR);
    }
    Bar.prototype.decrement = function (playerId) {
        _super.prototype.decrement.call(this, playerId);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    };
    Bar.prototype.increment = function (playerId, count) {
        _super.prototype.increment.call(this, playerId, count);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    };
    Bar.prototype.setSelected = function (playerId, on) {
        if (this.onSetSelected) {
            this.onSetSelected(playerId, on);
        }
    };
    Bar.prototype.setValidSource = function (playerId, on) {
        if (this.onSetValidSource) {
            this.onSetValidSource(playerId, on);
        }
    };
    return Bar;
})(CheckerContainer);
/// <reference path="CheckerContainerUI.ts"/>
var HomeUI = (function (_super) {
    __extends(HomeUI, _super);
    function HomeUI(player) {
        _super.call(this, 'home', player === PlayerId.BLACK);
    }
    return HomeUI;
})(CheckerContainerUI);
/// <reference path="BarUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="HomeUI.ts"/>
/// <reference path="PointUI.ts"/>
/// <reference path="Utils.ts"/>
var BoardUI = (function () {
    function BoardUI(gameContainerId) {
        this.containerDiv = document.createElement('div');
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.className = 'board';
        this.blackHomeUI = new HomeUI(PlayerId.BLACK);
        this.blackHomeUI.containerDiv.id = gameContainerId + "_blackhome";
        this.redHomeUI = new HomeUI(PlayerId.RED);
        this.redHomeUI.containerDiv.id = gameContainerId + "_redhome";
        this.pointUIs = new Array(24);
        for (var i = 0; i < this.pointUIs.length; i++) {
            var colour = (i % 2 == 0) ? 'black' : 'red';
            var isTopSide = i >= 12;
            this.pointUIs[i] = new PointUI(colour, isTopSide);
            this.pointUIs[i].containerDiv.id = gameContainerId + "_point" + (i + 1);
        }
        this.blackBarUI = new BarUI(PlayerId.BLACK);
        this.redBarUI = new BarUI(PlayerId.RED);
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
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        _super.call(this, PointId.HOME);
    }
    Home.prototype.increment = function (playerId) {
        _super.prototype.increment.call(this, playerId, 1);
        if (this.onIncrement) {
            this.onIncrement(playerId, this.checkers[playerId]);
        }
    };
    Home.prototype.setValidDestination = function (playerId, on) {
        if (this.onSetValidDestination) {
            this.onSetValidDestination(playerId, on);
        }
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
        var onPointSelected = function (checkerContainer) {
            if (_this.onPointSelected) {
                _this.onPointSelected(checkerContainer);
            }
        };
        this.checkerContainers = new Array(26);
        var homeUIs = new Array(2);
        homeUIs[PlayerId.BLACK] = this.boardUI.blackHomeUI;
        homeUIs[PlayerId.RED] = this.boardUI.redHomeUI;
        var home = new Home();
        this.boardUI.blackHomeUI.onSelected = function () { return onPointSelected(home); };
        this.boardUI.redHomeUI.onSelected = function () { return onPointSelected(home); };
        home.onIncrement = function (playerId, count) {
            homeUIs[playerId].setCheckers(playerId, count);
        };
        home.onSetValidDestination = function (playerId, on) {
            homeUIs[playerId].setValidDestination(on);
        };
        this.checkerContainers[PointId.HOME] = home;
        for (var i = 1; i < 25; i++) {
            this.checkerContainers[i] = new Point(this.boardUI.pointUIs[i - 1], i, onPointInspected, onPointSelected);
        }
        var barUIs = new Array(2);
        barUIs[PlayerId.BLACK] = this.boardUI.blackBarUI;
        barUIs[PlayerId.RED] = this.boardUI.redBarUI;
        var bar = new Bar();
        this.boardUI.blackBarUI.onInspected = function (on) { return onPointInspected(bar, on); };
        this.boardUI.blackBarUI.onSelected = function () { return onPointSelected(bar); };
        this.boardUI.redBarUI.onInspected = function (on) { return onPointInspected(bar, on); };
        this.boardUI.redBarUI.onSelected = function () { return onPointSelected(bar); };
        bar.onCheckerCountChanged = function (playerId, count) {
            barUIs[playerId].setCheckers(playerId, count);
        };
        bar.onSetSelected = function (playerId, on) {
            barUIs[playerId].setSelected(on);
        };
        bar.onSetValidSource = function (playerId, on) {
            barUIs[playerId].setSelected(on);
        };
        this.checkerContainers[PointId.BAR] = bar;
        this.increment(PlayerId.RED, 24, 2);
        this.increment(PlayerId.BLACK, 1, 2);
        this.increment(PlayerId.RED, 6, 5);
        this.increment(PlayerId.BLACK, 19, 5);
        this.increment(PlayerId.RED, 8, 3);
        this.increment(PlayerId.BLACK, 17, 3);
        this.increment(PlayerId.RED, 13, 5);
        this.increment(PlayerId.BLACK, 12, 5);
    }
    Board.prototype.decrement = function (player, pointId) {
        this.checkerContainers[pointId].decrement(player);
    };
    Board.prototype.increment = function (player, pointId, count) {
        this.checkerContainers[pointId].increment(player, count || 1);
    };
    Board.getDestinationPointId = function (player, sourcePointId, numberOfMoves) {
        switch (player) {
            case PlayerId.BLACK: {
                if (sourcePointId === PointId.BAR) {
                    return numberOfMoves;
                }
                var destinationPointId = sourcePointId + numberOfMoves;
                if (destinationPointId > 24) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            case PlayerId.RED: {
                if (sourcePointId === PointId.BAR) {
                    return PointId.BAR - numberOfMoves;
                }
                var destinationPointId = sourcePointId - numberOfMoves;
                if (destinationPointId < 1) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            default: throw "Unknown player: " + player;
        }
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
        var direction = (player === PlayerId.BLACK) ? 1 : -1;
        var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        if (destinationPointId === PointId.HOME) {
            // check that there are no checkers outside of home board. (BAR has already been checked above)
            var startingPointOfOuterBoard = (player === PlayerId.BLACK) ? 1 : 24;
            var totalPointsOfOuterBoard = 18;
            for (var offset = 0; offset < totalPointsOfOuterBoard; offset++) {
                if (this.checkerContainers[startingPointOfOuterBoard + (direction * offset)].checkers[player] > 0) {
                    return false;
                }
            }
            // check that there are no checkers more deserving of this dice roll
            var actualDestinationPointId = sourcePointId + (direction * numberOfMoves);
            // if it's dead on, we're fine.
            if (actualDestinationPointId === 0 || actualDestinationPointId === 25) {
                return true;
            }
            var startingPointOfHomeBoard = (player === PlayerId.BLACK) ? 18 : 6;
            for (var homeBoardPointId = startingPointOfHomeBoard; homeBoardPointId !== sourcePointId; homeBoardPointId += direction) {
                if (this.checkerContainers[homeBoardPointId].checkers[player] > 0) {
                    // if we find a checker on a further out point, sourcePointId is not valid
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
        if (destinationPointId !== PointId.HOME &&
            this.checkerContainers[destinationPointId].checkers[otherPlayer] == 1) {
            this.decrement(otherPlayer, destinationPointId);
            this.increment(otherPlayer, PointId.BAR);
        }
        this.decrement(player, sourcePointId);
        this.increment(player, destinationPointId);
        return true;
    };
    Board.prototype.checkIfValidDestination = function (player, sourcePointId, numberOfMoves) {
        if (this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
            if (destinationPointId === PointId.HOME) {
                this.checkerContainers[PointId.HOME].setValidDestination(player, true);
            }
            else {
                this.checkerContainers[destinationPointId].setValidDestination(true);
            }
        }
    };
    Board.prototype.removeAllHighlights = function () {
        for (var pointId = 1; pointId <= 24; pointId++) {
            this.checkerContainers[pointId].setValidDestination(false);
        }
        this.checkerContainers[PointId.HOME].setValidDestination(PlayerId.BLACK, false);
        this.checkerContainers[PointId.HOME].setValidDestination(PlayerId.RED, false);
    };
    return Board;
})();
var Die = (function () {
    function Die(value) {
        this.value = value;
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
var DiceRollGenerator = (function () {
    function DiceRollGenerator() {
    }
    DiceRollGenerator.prototype.generateDiceRoll = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    return DiceRollGenerator;
})();
/// <reference path="Die.ts" />
/// <reference path="Enums.ts"/>
var DiceUI = (function () {
    function DiceUI(player) {
        this.containerDiv = document.createElement('div');
        this.containerDiv.className = "dice-container dice-container-" + PlayerId[player].toLowerCase();
    }
    DiceUI.prototype.setStartingDiceRoll = function (die) {
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.appendChild(DiceUI.createDie(die));
    };
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
/// <reference path="Utils.ts"/>
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
        Utils.highlight(statusP);
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
/// <reference path="Die.ts"/>
/// <reference path="DiceRollGenerator.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="StatusLogger.ts"/>
var Dice = (function () {
    function Dice(diceRollGenerator, blackDiceUI, redDiceUI) {
        this.diceRollGenerator = diceRollGenerator;
        this.diceUIs = new Array();
        this.diceUIs[PlayerId.BLACK] = blackDiceUI;
        this.diceUIs[PlayerId.RED] = redDiceUI;
    }
    Dice.prototype.rollToStart = function (statusLogger, onSuccess) {
        var _this = this;
        var die1 = new Die(this.diceRollGenerator.generateDiceRoll());
        var die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        this.diceUIs[PlayerId.BLACK].setStartingDiceRoll(die1);
        this.diceUIs[PlayerId.RED].setStartingDiceRoll(die2);
        statusLogger.logInfo("BLACK rolls " + die1.value);
        statusLogger.logInfo("RED rolls " + die2.value);
        if (die1.value === die2.value) {
            statusLogger.logInfo('DRAW! Roll again');
            setTimeout(function () { _this.rollToStart(statusLogger, onSuccess); }, 1000);
        }
        else {
            var successfulPlayer = die1.value > die2.value ? PlayerId.BLACK : PlayerId.RED;
            statusLogger.logInfo(PlayerId[successfulPlayer] + " wins the starting roll");
            setTimeout(function () {
                _this.die1 = die1;
                _this.die2 = die2;
                _this.diceUIs[successfulPlayer].setDiceRolls(die1, die2);
                _this.diceUIs[successfulPlayer].setActive(true);
                onSuccess(successfulPlayer);
            }, 1000);
        }
    };
    Dice.prototype.roll = function (player) {
        this.die1 = new Die(this.diceRollGenerator.generateDiceRoll());
        this.die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        var isDouble = (this.die1.value === this.die2.value);
        if (isDouble) {
            this.die1.remainingUses = 2;
            this.die2.remainingUses = 2;
        }
        this.diceUIs[player].setDiceRolls(this.die1, this.die2);
        this.diceUIs[player].setActive(true);
        var otherPlayer = player === PlayerId.BLACK ? PlayerId.RED : PlayerId.BLACK;
        this.diceUIs[otherPlayer].setActive(false);
    };
    return Dice;
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
        this.boardUI = new BoardUI(containerElementId);
        this.blackDiceUI = new DiceUI(PlayerId.BLACK);
        this.redDiceUI = new DiceUI(PlayerId.RED);
        this.statusUI = new StatusUI();
        container.appendChild(this.boardUI.containerDiv);
        var sideContainer = document.createElement('div');
        sideContainer.className = 'side-container';
        sideContainer.appendChild(this.blackDiceUI.containerDiv);
        sideContainer.appendChild(this.statusUI.containerDiv);
        sideContainer.appendChild(this.redDiceUI.containerDiv);
        container.appendChild(sideContainer);
    }
    return GameUI;
})();
/// <reference path="Board.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>
var Game = (function () {
    function Game(gameUI, board, dice, statusLogger, currentPlayer) {
        var _this = this;
        this.board = board;
        this.dice = dice;
        this.statusLogger = statusLogger;
        this.currentPlayer = currentPlayer;
        this.logCurrentPlayer();
        this.evaluateBoard();
        this.board.onPointInspected = function (checkerContainer, on) {
            if (_this.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }
            if (!on) {
                _this.board.removeAllHighlights();
                return;
            }
            if (!(checkerContainer instanceof Home) && (checkerContainer.checkers[_this.currentPlayer] > 0)) {
                for (var _i = 0, _a = [_this.dice.die1, _this.dice.die2]; _i < _a.length; _i++) {
                    var die = _a[_i];
                    if (die.remainingUses > 0) {
                        _this.board.checkIfValidDestination(_this.currentPlayer, checkerContainer.pointId, die.value);
                    }
                }
            }
        };
        this.board.onPointSelected = function (checkerContainer) {
            if (_this.currentSelectedCheckerContainer == undefined) {
                if (checkerContainer.checkers[_this.currentPlayer] == 0) {
                    // if no pieces here, exit
                    return;
                }
                var canUseDie = function (die) {
                    return (die.remainingUses > 0 &&
                        _this.board.isLegalMove(_this.currentPlayer, checkerContainer.pointId, die.value));
                };
                var canBearOff = function (die) {
                    return (die.remainingUses > 0 &&
                        Board.getDestinationPointId(_this.currentPlayer, checkerContainer.pointId, die.value) === PointId.HOME &&
                        _this.board.isLegalMove(_this.currentPlayer, checkerContainer.pointId, die.value));
                };
                var canUseDie1 = canUseDie(_this.dice.die1);
                var canUseDie2 = canUseDie(_this.dice.die2);
                // if can use one die but not the other, or if it's doubles, or if both bear off home, just play it
                if ((canUseDie1 != canUseDie2) ||
                    (_this.dice.die1.value === _this.dice.die2.value) ||
                    (canBearOff(_this.dice.die1) && canBearOff(_this.dice.die2))) {
                    if (canUseDie1) {
                        _this.board.move(_this.currentPlayer, checkerContainer.pointId, _this.dice.die1.value);
                        _this.dice.die1.decrementRemainingUses();
                        _this.evaluateBoard();
                    }
                    else if (canUseDie2) {
                        _this.board.move(_this.currentPlayer, checkerContainer.pointId, _this.dice.die2.value);
                        _this.dice.die2.decrementRemainingUses();
                        _this.evaluateBoard();
                    }
                    _this.switchPlayerIfNoValidMovesRemain();
                    // reinspect point
                    _this.board.onPointInspected(checkerContainer, false);
                    _this.board.onPointInspected(checkerContainer, true);
                }
                else if (canUseDie1 || canUseDie2) {
                    if (checkerContainer instanceof Point) {
                        checkerContainer.setSelected(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        checkerContainer.setSelected(_this.currentPlayer, true);
                    }
                    _this.currentSelectedCheckerContainer = checkerContainer;
                    _this.evaluateBoard();
                }
            }
            else if (checkerContainer.pointId === _this.currentSelectedCheckerContainer.pointId) {
                if (_this.currentSelectedCheckerContainer instanceof Point) {
                    _this.currentSelectedCheckerContainer.setSelected(false);
                }
                _this.currentSelectedCheckerContainer = undefined;
                _this.evaluateBoard();
            }
            else {
                var useDieIfPossible = function (die) {
                    var destinationPointId = Board.getDestinationPointId(_this.currentPlayer, _this.currentSelectedCheckerContainer.pointId, die.value);
                    if (destinationPointId !== checkerContainer.pointId) {
                        return false;
                    }
                    _this.board.move(_this.currentPlayer, _this.currentSelectedCheckerContainer.pointId, die.value);
                    die.decrementRemainingUses();
                    if (_this.currentSelectedCheckerContainer instanceof Point) {
                        _this.currentSelectedCheckerContainer.setSelected(false);
                    }
                    _this.currentSelectedCheckerContainer = undefined;
                    _this.evaluateBoard();
                    return true;
                };
                // use lazy evaluation so that max one die gets used
                useDieIfPossible(_this.dice.die1) || useDieIfPossible(_this.dice.die2);
                _this.switchPlayerIfNoValidMovesRemain();
                // reinspect point
                _this.board.onPointInspected(checkerContainer, false);
                _this.board.onPointInspected(checkerContainer, true);
            }
        };
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
        if (this.board.checkerContainers[PointId.HOME].checkers[this.currentPlayer] === 15) {
            this.statusLogger.logInfo(PlayerId[this.currentPlayer] + " WINS!");
            return;
        }
        if (!this.checkIfValidMovesRemain()) {
            // if we're still here, 
            this.switchPlayer();
            this.dice.roll(this.currentPlayer);
            this.evaluateBoard();
            this.switchPlayerIfNoValidMovesRemain();
        }
    };
    Game.getOtherPlayer = function (player) {
        return player === PlayerId.BLACK ? PlayerId.RED : PlayerId.BLACK;
    };
    Game.prototype.switchPlayer = function () {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.logCurrentPlayer();
    };
    Game.prototype.evaluateBoard = function () {
        var _this = this;
        if (this.currentSelectedCheckerContainer != undefined) {
            for (var i = 1; i <= 24; i++) {
                if (i !== this.currentSelectedCheckerContainer.pointId) {
                    this.board.checkerContainers[i].setValidSource(false);
                }
            }
            return;
        }
        var isValidSource = function (pointId) {
            if (_this.board.checkerContainers[pointId].checkers[_this.currentPlayer] > 0) {
                for (var _i = 0, _a = [_this.dice.die1, _this.dice.die2]; _i < _a.length; _i++) {
                    var die = _a[_i];
                    if ((die.remainingUses > 0) &&
                        (_this.board.isLegalMove(_this.currentPlayer, pointId, die.value))) {
                        return true;
                    }
                }
            }
            return false;
        };
        this.board.checkerContainers[PointId.BAR].setValidSource(this.currentPlayer, isValidSource(PointId.BAR));
        for (var i = 1; i <= 24; i++) {
            this.board.checkerContainers[i].setValidSource(isValidSource(i));
        }
    };
    Game.prototype.logCurrentPlayer = function () {
        this.statusLogger.logInfo(PlayerId[this.currentPlayer] + " to move");
    };
    return Game;
})();
/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="DiceRollGenerator.ts"/>
/// <reference path="Game.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>
var Backgammon = (function () {
    function Backgammon(containerId) {
        var ui = new GameUI(containerId);
        var board = new Board(ui.boardUI);
        var dice = new Dice(new DiceRollGenerator(), ui.blackDiceUI, ui.redDiceUI);
        var statusLogger = new StatusLogger(ui.statusUI);
        dice.rollToStart(statusLogger, function (successfulPlayer) {
            new Game(ui, board, dice, statusLogger, successfulPlayer);
        });
    }
    return Backgammon;
})();
