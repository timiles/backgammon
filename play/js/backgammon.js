var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlayerId;
(function (PlayerId) {
    PlayerId[PlayerId["BLACK"] = 0] = "BLACK";
    PlayerId[PlayerId["RED"] = 1] = "RED";
})(PlayerId || (PlayerId = {}));
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
}());
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Enums.ts"/>
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
}(CheckerContainer));
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Enums.ts"/>
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
}(CheckerContainer));
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Enums.ts"/>
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(pointId) {
        _super.call(this, pointId);
    }
    Point.prototype.decrement = function (playerId) {
        _super.prototype.decrement.call(this, playerId);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    };
    Point.prototype.increment = function (playerId, count) {
        _super.prototype.increment.call(this, playerId, count);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    };
    Point.prototype.setValidDestination = function (on) {
        if (this.onSetValidDestination) {
            this.onSetValidDestination(on);
        }
    };
    Point.prototype.setValidSource = function (on) {
        if (this.onSetValidSource) {
            this.onSetValidSource(on);
        }
    };
    Point.prototype.setSelected = function (on) {
        if (this.onSetSelected) {
            this.onSetSelected(on);
        }
    };
    return Point;
}(CheckerContainer));
/// <reference path="Bar.ts"/>
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
    function Board() {
        var _this = this;
        this.checkerContainers = new Array(26);
        var home = new Home();
        home.onIncrement = function (playerId, count) {
            if (_this.onCheckerCountChanged) {
                _this.onCheckerCountChanged(PointId.HOME, playerId, count);
            }
        };
        home.onSetValidDestination = function (playerId, on) {
            if (_this.onSetHomeAsValidDestination) {
                _this.onSetHomeAsValidDestination(playerId, on);
            }
        };
        this.checkerContainers[PointId.HOME] = home;
        var createPoint = function (pointId) {
            var point = new Point(pointId);
            point.onCheckerCountChanged = function (playerId, count) {
                if (_this.onCheckerCountChanged) {
                    _this.onCheckerCountChanged(pointId, playerId, count);
                }
            };
            point.onSetSelected = function (on) {
                if (_this.onSetPointAsSelected) {
                    _this.onSetPointAsSelected(pointId, on);
                }
            };
            point.onSetValidDestination = function (on) {
                if (_this.onSetPointAsValidDestination) {
                    _this.onSetPointAsValidDestination(pointId, on);
                }
            };
            point.onSetValidSource = function (on) {
                if (_this.onSetPointAsValidSource) {
                    _this.onSetPointAsValidSource(pointId, on);
                }
            };
            return point;
        };
        for (var i = 1; i < 25; i++) {
            this.checkerContainers[i] = createPoint(i);
        }
        var bar = new Bar();
        bar.onCheckerCountChanged = function (playerId, count) {
            if (_this.onCheckerCountChanged) {
                _this.onCheckerCountChanged(PointId.BAR, playerId, count);
            }
        };
        bar.onSetSelected = function (playerId, on) {
            if (_this.onSetBarAsSelected) {
                _this.onSetBarAsSelected(playerId, on);
            }
        };
        bar.onSetValidSource = function (playerId, on) {
            if (_this.onSetBarAsValidSource) {
                _this.onSetBarAsValidSource(playerId, on);
            }
        };
        this.checkerContainers[PointId.BAR] = bar;
    }
    Board.prototype.initialise = function (layout) {
        if (layout === undefined) {
            layout = [[0, 0],
                [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],
                [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],
                [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],
                [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2],
                [0, 0]];
        }
        for (var pointId = 0; pointId < 26; pointId++) {
            for (var _i = 0, _a = [PlayerId.BLACK, PlayerId.RED]; _i < _a.length; _i++) {
                var playerId = _a[_i];
                var checkerCount = layout[pointId][playerId];
                if (checkerCount > 0) {
                    this.increment(playerId, pointId, checkerCount);
                }
            }
        }
    };
    Board.prototype.decrement = function (player, pointId) {
        this.checkerContainers[pointId].decrement(player);
    };
    Board.prototype.increment = function (player, pointId, count) {
        this.checkerContainers[pointId].increment(player, count || 1);
    };
    Board.getDestinationPointId = function (player, sourcePointId, numberOfPointsToMove) {
        switch (player) {
            case PlayerId.BLACK: {
                if (sourcePointId === PointId.BAR) {
                    return numberOfPointsToMove;
                }
                var destinationPointId = sourcePointId + numberOfPointsToMove;
                if (destinationPointId > 24) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            case PlayerId.RED: {
                if (sourcePointId === PointId.BAR) {
                    return PointId.BAR - numberOfPointsToMove;
                }
                var destinationPointId = sourcePointId - numberOfPointsToMove;
                if (destinationPointId < 1) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            default: throw "Unknown player: " + player;
        }
    };
    Board.prototype.isLegalMove = function (player, sourcePointId, numberOfPointsToMove) {
        // case: there is no counter to move: fail
        if (this.checkerContainers[sourcePointId].checkers[player] == 0) {
            // console.info('no counter at ' + sourcePointId);
            return false;
        }
        // case: there is a counter on the bar, and this is not it
        if ((sourcePointId != PointId.BAR) && (this.checkerContainers[PointId.BAR].checkers[player] > 0)) {
            // console.info('must move counter off bar first');
            return false;
        }
        // case: bearing off
        var direction = (player === PlayerId.BLACK) ? 1 : -1;
        var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfPointsToMove);
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
            var actualDestinationPointId = sourcePointId + (direction * numberOfPointsToMove);
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
            // console.info('point is blocked');
            return false;
        }
        return true;
    };
    Board.prototype.move = function (player, sourcePointId, numberOfPointsToMove) {
        if (!this.isLegalMove(player, sourcePointId, numberOfPointsToMove)) {
            return false;
        }
        var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfPointsToMove);
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
    Board.prototype.checkIfValidDestination = function (player, sourcePointId, numberOfPointsToMove) {
        if (this.isLegalMove(player, sourcePointId, numberOfPointsToMove)) {
            var destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfPointsToMove);
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
}());
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
}());
var DiceRollGenerator = (function () {
    function DiceRollGenerator() {
    }
    DiceRollGenerator.prototype.generateDiceRoll = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    return DiceRollGenerator;
}());
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
}());
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
}());
/// <reference path="UI/Utils.ts"/>
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
}());
/// <reference path="StatusUI.ts"/>
var StatusLogger = (function () {
    function StatusLogger(statusUI) {
        this.statusUI = statusUI;
    }
    StatusLogger.prototype.logInfo = function (s) {
        this.statusUI.setStatus(s);
    };
    return StatusLogger;
}());
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
            var successfulPlayer_1 = die1.value > die2.value ? PlayerId.BLACK : PlayerId.RED;
            statusLogger.logInfo(PlayerId[successfulPlayer_1] + " wins the starting roll");
            setTimeout(function () {
                _this.die1 = die1;
                _this.die2 = die2;
                _this.diceUIs[successfulPlayer_1].setDiceRolls(die1, die2);
                _this.diceUIs[successfulPlayer_1].setActive(true);
                onSuccess(successfulPlayer_1);
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
}());
var Move = (function () {
    function Move(sourcePointId, numberOfPointsToMove) {
        this.sourcePointId = sourcePointId;
        this.numberOfPointsToMove = numberOfPointsToMove;
    }
    return Move;
}());
/// <reference path="Board.ts"/>
/// <reference path="Move.ts"/>
var PossibleGo = (function () {
    function PossibleGo(moves, resultantBoard) {
        this.moves = moves;
        this.resultantBoard = resultantBoard;
    }
    return PossibleGo;
}());
/// <reference path="Board.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Move.ts"/>
/// <reference path="PossibleGo.ts"/>
var BoardEvaluator = (function () {
    function BoardEvaluator() {
    }
    BoardEvaluator.isRace = function (board) {
        var playerId = 0;
        for (var pointId = 1; pointId <= 24; pointId++) {
            if (board.checkerContainers[pointId].checkers[playerId] > 0) {
                if (playerId === 0) {
                    // once we've found a checker of one player, switch and we'll look for the other
                    playerId++;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    BoardEvaluator.getPossibleGoes = function (board, playerId, die1Value, die2Value) {
        var possibleGoes = new Array();
        // 1. double number thrown.
        if (die1Value === die2Value) {
            var points_1 = die1Value;
            var testBoard = new Array(4);
            var numOfMoves = 0;
            // 25: include bar
            for (var i1 = 1; i1 <= 25; i1++) {
                testBoard[0] = BoardEvaluator.clone(board);
                if (!testBoard[0].move(playerId, i1, points_1)) {
                    continue;
                }
                possibleGoes.push(new PossibleGo([new Move(i1, points_1)], testBoard[0]));
                for (var i2 = 1; i2 <= 25; i2++) {
                    testBoard[1] = BoardEvaluator.clone(testBoard[0]);
                    if (!testBoard[1].move(playerId, i2, points_1)) {
                        continue;
                    }
                    possibleGoes.push(new PossibleGo([new Move(i1, points_1), new Move(i2, points_1)], testBoard[1]));
                    for (var i3 = 1; i3 <= 25; i3++) {
                        testBoard[2] = BoardEvaluator.clone(testBoard[1]);
                        if (!testBoard[2].move(playerId, i3, points_1)) {
                            continue;
                        }
                        possibleGoes.push(new PossibleGo([new Move(i1, points_1), new Move(i2, points_1), new Move(i3, points_1)], testBoard[2]));
                        for (var i4 = 1; i4 <= 25; i4++) {
                            testBoard[3] = BoardEvaluator.clone(testBoard[2]);
                            if (testBoard[3].move(playerId, i4, points_1)) {
                                possibleGoes.push(new PossibleGo([new Move(i1, points_1), new Move(i2, points_1), new Move(i3, points_1), new Move(i4, points_1)], testBoard[3]));
                            }
                        }
                    }
                }
            }
            return BoardEvaluator.getPossibleGoesThatUseMostDice(possibleGoes);
        }
        // 2. non-double thrown.
        var points = [die1Value, die2Value];
        for (var startPoint1 = 1; startPoint1 <= 25; startPoint1++) {
            for (var die = 0; die < 2; die++) {
                var testBoard1 = BoardEvaluator.clone(board);
                if (testBoard1.move(playerId, startPoint1, points[die])) {
                    if (!BoardEvaluator.canMove(testBoard1, playerId, points[(die + 1) % 2])) {
                        possibleGoes.push(new PossibleGo([new Move(startPoint1, points[die])], BoardEvaluator.clone(testBoard1)));
                        continue;
                    }
                    // else 
                    for (var startPoint2 = 1; startPoint2 <= 25; startPoint2++) {
                        var testBoard2 = BoardEvaluator.clone(testBoard1);
                        if (testBoard2.move(playerId, startPoint2, points[(die + 1) % 2])) {
                            possibleGoes.push(new PossibleGo([new Move(startPoint1, points[die]), new Move(startPoint2, points[(die + 1) % 2])], BoardEvaluator.clone(testBoard2)));
                            continue;
                        }
                    }
                }
            }
        }
        return BoardEvaluator.getPossibleGoesThatUseMostDice(possibleGoes);
    };
    BoardEvaluator.clone = function (source) {
        var clone = new Board();
        var layout = new Array();
        for (var pointId = 0; pointId < 26; pointId++) {
            layout[pointId] = [source.checkerContainers[pointId].checkers[PlayerId.BLACK], source.checkerContainers[pointId].checkers[PlayerId.RED]];
        }
        clone.initialise(layout);
        return clone;
    };
    BoardEvaluator.canMove = function (board, playerId, points) {
        // 25: include bar
        for (var startingPoint = 1; startingPoint <= 25; startingPoint++) {
            if (board.isLegalMove(playerId, startingPoint, points)) {
                return true;
            }
        }
        return false;
    };
    BoardEvaluator.getPossibleGoesThatUseMostDice = function (possibleGoes) {
        var max = 0;
        // 1. find move with most amount of dice used
        for (var i = 0; i < possibleGoes.length; i++) {
            max = Math.max(max, possibleGoes[i].moves.length);
        }
        var goesThatUseMostDice = new Array();
        // 2. copy into new array all with length of max
        for (var i = 0; i < possibleGoes.length; i++) {
            if (possibleGoes[i].moves.length === max) {
                goesThatUseMostDice.push(possibleGoes[i]);
            }
        }
        return goesThatUseMostDice;
    };
    return BoardEvaluator;
}());
var Player = (function () {
    function Player(playerId, board) {
        this.playerId = playerId;
        this.board = board;
    }
    return Player;
}());
/// <reference path="Board.ts"/>
/// <reference path="BoardEvaluator.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Player.ts"/>
/// <reference path="StatusLogger.ts"/>
var ComputerPlayer = (function (_super) {
    __extends(ComputerPlayer, _super);
    function ComputerPlayer(playerId, board) {
        _super.call(this, playerId, board);
        this.safetyFactor = 1;
        this.clusteringFactor = 1;
        this.offensiveFactor = 1;
        this.reentryFactor = 1;
    }
    ComputerPlayer.prototype.getBestPossibleGo = function (die1Value, die2Value) {
        var possibleGoes = BoardEvaluator.getPossibleGoes(this.board, this.playerId, die1Value, die2Value);
        if (possibleGoes.length === 0) {
            console.info('No possible go');
            return null;
        }
        var maxScore = 0;
        var maxScoreIndex = 0;
        for (var i = 0; i < possibleGoes.length; i++) {
            var score = this.evaluateBoard(possibleGoes[i].resultantBoard);
            // greater than or equal: bias towards further on moves
            if (score >= maxScore) {
                maxScore = score;
                maxScoreIndex = i;
            }
        }
        return possibleGoes[maxScoreIndex];
    };
    ComputerPlayer.prototype.evaluateBoard = function (b) {
        return this.evaluateSafety(b) * this.safetyFactor +
            this.evaluateClustering(b) * this.clusteringFactor +
            this.evaluateOffensive(b) * this.offensiveFactor;
    };
    /**
     * return score of how safe the stones are.
     */
    ComputerPlayer.prototype.evaluateSafety = function (b) {
        // if the game is a race, safety is irrelevant
        if (BoardEvaluator.isRace(b)) {
            return 0;
        }
        var score = 100;
        var direction = (this.playerId === PlayerId.BLACK) ? 1 : -1;
        var homePointId = (this.playerId === PlayerId.BLACK) ? 25 : 0;
        for (var pointId = 1; pointId <= 24; pointId++) {
            if (b.checkerContainers[pointId].checkers[this.playerId] === 1) {
                // TODO: factor safety on prob of opp hitting this piece
                var distanceOfBlotToHome = (homePointId - pointId) * direction;
                var relativePenaltyOfLosingThisBlot = distanceOfBlotToHome / 24;
                score *= (.75 * relativePenaltyOfLosingThisBlot);
            }
        }
        return score;
    };
    /**
     * return score of how clustered the towers are.
     */
    ComputerPlayer.prototype.evaluateClustering = function (b) {
        var score = 0;
        // number of towers
        // proximity of towers
        return score;
    };
    /**
     * offensive: putting opponent onto bar
     */
    ComputerPlayer.prototype.evaluateOffensive = function (b) {
        var otherPlayerId = (this.playerId + 1) % 2;
        switch (b.checkerContainers[PointId.BAR].checkers[otherPlayerId]) {
            case 0: return 0;
            case 1: return 65;
            default: return 100;
        }
    };
    return ComputerPlayer;
}(Player));
var HumanPlayer = (function (_super) {
    __extends(HumanPlayer, _super);
    function HumanPlayer() {
        _super.apply(this, arguments);
    }
    return HumanPlayer;
}(Player));
/// <reference path="Board.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="ComputerPlayer.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="HumanPlayer.ts"/>
/// <reference path="Player.ts"/>
/// <reference path="StatusLogger.ts"/>
var Game = (function () {
    function Game(board, dice, statusLogger, isComputerPlayer) {
        var _this = this;
        if (isComputerPlayer === void 0) { isComputerPlayer = [false, false]; }
        this.board = board;
        this.dice = dice;
        this.statusLogger = statusLogger;
        this.players = new Array(2);
        for (var _i = 0, _a = [PlayerId.BLACK, PlayerId.RED]; _i < _a.length; _i++) {
            var playerId = _a[_i];
            this.players[playerId] = (isComputerPlayer[playerId]) ? new ComputerPlayer(playerId, this.board) : new HumanPlayer(playerId, this.board);
        }
        this.board.onPointInspected = function (pointId, on) {
            if (_this.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }
            if (!on) {
                _this.board.removeAllHighlights();
                return;
            }
            var checkerContainer = _this.board.checkerContainers[pointId];
            if (!(checkerContainer instanceof Home) && (checkerContainer.checkers[_this.currentPlayerId] > 0)) {
                for (var _i = 0, _a = [_this.dice.die1, _this.dice.die2]; _i < _a.length; _i++) {
                    var die = _a[_i];
                    if (die.remainingUses > 0) {
                        _this.board.checkIfValidDestination(_this.currentPlayerId, checkerContainer.pointId, die.value);
                    }
                }
            }
        };
        this.board.onPointSelected = function (pointId) {
            var checkerContainer = _this.board.checkerContainers[pointId];
            if (_this.currentSelectedCheckerContainer == undefined) {
                if (checkerContainer.checkers[_this.currentPlayerId] == 0) {
                    // if no pieces here, exit
                    return;
                }
                var canUseDie = function (die) {
                    return (die.remainingUses > 0 &&
                        _this.board.isLegalMove(_this.currentPlayerId, checkerContainer.pointId, die.value));
                };
                var canBearOff = function (die) {
                    return (die.remainingUses > 0 &&
                        Board.getDestinationPointId(_this.currentPlayerId, checkerContainer.pointId, die.value) === PointId.HOME &&
                        _this.board.isLegalMove(_this.currentPlayerId, checkerContainer.pointId, die.value));
                };
                var canUseDie1 = canUseDie(_this.dice.die1);
                var canUseDie2 = canUseDie(_this.dice.die2);
                // if can use one die but not the other, or if it's doubles, or if both bear off home, just play it
                if ((canUseDie1 != canUseDie2) ||
                    (_this.dice.die1.value === _this.dice.die2.value) ||
                    (canBearOff(_this.dice.die1) && canBearOff(_this.dice.die2))) {
                    if (canUseDie1) {
                        _this.board.move(_this.currentPlayerId, checkerContainer.pointId, _this.dice.die1.value);
                        _this.dice.die1.decrementRemainingUses();
                        _this.evaluateBoard();
                    }
                    else if (canUseDie2) {
                        _this.board.move(_this.currentPlayerId, checkerContainer.pointId, _this.dice.die2.value);
                        _this.dice.die2.decrementRemainingUses();
                        _this.evaluateBoard();
                    }
                    _this.switchPlayerIfNoValidMovesRemain();
                    // reinspect point
                    if (_this.board.onPointInspected) {
                        _this.board.onPointInspected(checkerContainer.pointId, false);
                        _this.board.onPointInspected(checkerContainer.pointId, true);
                    }
                }
                else if (canUseDie1 || canUseDie2) {
                    if (checkerContainer instanceof Point) {
                        checkerContainer.setSelected(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        checkerContainer.setSelected(_this.currentPlayerId, true);
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
                    var destinationPointId = Board.getDestinationPointId(_this.currentPlayerId, _this.currentSelectedCheckerContainer.pointId, die.value);
                    if (destinationPointId !== checkerContainer.pointId) {
                        return false;
                    }
                    _this.board.move(_this.currentPlayerId, _this.currentSelectedCheckerContainer.pointId, die.value);
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
                if (_this.board.onPointInspected) {
                    _this.board.onPointInspected(checkerContainer.pointId, false);
                    _this.board.onPointInspected(checkerContainer.pointId, true);
                }
            }
        };
    }
    Game.prototype.begin = function (startingPlayerId) {
        this.currentPlayerId = startingPlayerId;
        this.logCurrentPlayer();
        this.evaluateBoard();
        this.switchPlayerIfNoValidMovesRemain();
    };
    Game.prototype.checkIfValidMovesRemain = function () {
        var _this = this;
        if (this.dice.die1.remainingUses == 0 && this.dice.die2.remainingUses == 0) {
            return false;
        }
        var isValidMove = function (die, pointId) {
            return (die.remainingUses > 0) && _this.board.isLegalMove(_this.currentPlayerId, pointId, die.value);
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
        var _this = this;
        if (this.board.checkerContainers[PointId.HOME].checkers[this.currentPlayerId] === 15) {
            this.statusLogger.logInfo(PlayerId[this.currentPlayerId] + " WINS!");
            return;
        }
        if (!this.checkIfValidMovesRemain()) {
            // if we're still here, 
            this.switchPlayer();
            this.dice.roll(this.currentPlayerId);
            this.evaluateBoard();
            this.switchPlayerIfNoValidMovesRemain();
            return;
        }
        if (this.players[this.currentPlayerId] instanceof ComputerPlayer) {
            var computerPlayer = this.players[this.currentPlayerId];
            var bestPossibleGo = computerPlayer.getBestPossibleGo(this.dice.die1.value, this.dice.die2.value);
            if (bestPossibleGo) {
                for (var moveNumber = 0; moveNumber < bestPossibleGo.moves.length; moveNumber++) {
                    var move = bestPossibleGo.moves[moveNumber];
                    this.board.move(this.currentPlayerId, move.sourcePointId, move.numberOfPointsToMove);
                }
                console.log(bestPossibleGo);
            }
            setTimeout(function () {
                _this.switchPlayer();
                _this.dice.roll(_this.currentPlayerId);
                _this.evaluateBoard();
                _this.switchPlayerIfNoValidMovesRemain();
            }, 500);
        }
    };
    Game.getOtherPlayer = function (player) {
        return player === PlayerId.BLACK ? PlayerId.RED : PlayerId.BLACK;
    };
    Game.prototype.switchPlayer = function () {
        this.currentPlayerId = (this.currentPlayerId + 1) % 2;
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
            if (_this.board.checkerContainers[pointId].checkers[_this.currentPlayerId] > 0) {
                for (var _i = 0, _a = [_this.dice.die1, _this.dice.die2]; _i < _a.length; _i++) {
                    var die = _a[_i];
                    if ((die.remainingUses > 0) &&
                        (_this.board.isLegalMove(_this.currentPlayerId, pointId, die.value))) {
                        return true;
                    }
                }
            }
            return false;
        };
        this.board.checkerContainers[PointId.BAR].setValidSource(this.currentPlayerId, isValidSource(PointId.BAR));
        for (var i = 1; i <= 24; i++) {
            this.board.checkerContainers[i].setValidSource(isValidSource(i));
        }
    };
    Game.prototype.logCurrentPlayer = function () {
        this.statusLogger.logInfo(PlayerId[this.currentPlayerId] + " to move");
    };
    return Game;
}());
/// <reference path="../Enums.ts"/>
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
}());
/// <reference path="../Enums.ts"/>
/// <reference path="CheckerContainerUI.ts"/>
var BarUI = (function (_super) {
    __extends(BarUI, _super);
    function BarUI(player) {
        var _this = this;
        _super.call(this, 'bar', player === PlayerId.RED);
        this.containerDiv.onmouseover = function () { _this.onInspected(true); };
        this.containerDiv.onmouseout = function () { _this.onInspected(false); };
    }
    return BarUI;
}(CheckerContainerUI));
/// <reference path="../Enums.ts"/>
/// <reference path="CheckerContainerUI.ts"/>
var HomeUI = (function (_super) {
    __extends(HomeUI, _super);
    function HomeUI(player) {
        _super.call(this, 'home', player === PlayerId.BLACK);
    }
    return HomeUI;
}(CheckerContainerUI));
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
}(CheckerContainerUI));
/// <reference path="BarUI.ts"/>
/// <reference path="../Board.ts"/>
/// <reference path="HomeUI.ts"/>
/// <reference path="PointUI.ts"/>
/// <reference path="../Enums.ts"/>
var BoardUI = (function () {
    function BoardUI(gameContainerId, board) {
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
        this.bindEvents(board);
    }
    BoardUI.createClearBreak = function () {
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    };
    BoardUI.prototype.bindEvents = function (board) {
        var _this = this;
        // helpers
        var getBarUI = function (playerId) {
            return (playerId === PlayerId.BLACK) ? _this.blackBarUI : _this.redBarUI;
        };
        var getHomeUI = function (playerId) {
            return (playerId === PlayerId.BLACK) ? _this.blackHomeUI : _this.redHomeUI;
        };
        // wire up UI events
        this.blackHomeUI.onSelected = function () { return board.onPointSelected(PointId.HOME); };
        this.redHomeUI.onSelected = function () { return board.onPointSelected(PointId.HOME); };
        this.blackBarUI.onInspected = function (on) { return board.onPointInspected(PointId.BAR, on); };
        this.blackBarUI.onSelected = function () { return board.onPointSelected(PointId.BAR); };
        this.redBarUI.onInspected = function (on) { return board.onPointInspected(PointId.BAR, on); };
        this.redBarUI.onSelected = function () { return board.onPointSelected(PointId.BAR); };
        var bindPointUIEvents = function (pointId) {
            var pointUI = _this.pointUIs[pointId - 1];
            pointUI.onInspected = function (on) { board.onPointInspected(pointId, on); };
            pointUI.onSelected = function () { board.onPointSelected(pointId); };
        };
        for (var i = 1; i < 25; i++) {
            bindPointUIEvents(i);
        }
        board.onCheckerCountChanged = function (pointId, playerId, count) {
            switch (pointId) {
                case PointId.HOME: {
                    getHomeUI(playerId).setCheckers(playerId, count);
                    break;
                }
                case PointId.BAR: {
                    getBarUI(playerId).setCheckers(playerId, count);
                    break;
                }
                default: {
                    _this.pointUIs[pointId - 1].setCheckers(playerId, count);
                }
            }
        };
        board.onSetBarAsSelected = function (playerId, on) {
            getBarUI(playerId).setSelected(on);
        };
        board.onSetPointAsSelected = function (pointId, on) {
            _this.pointUIs[pointId - 1].setSelected(on);
        };
        board.onSetHomeAsValidDestination = function (playerId, on) {
            getHomeUI(playerId).setValidDestination(on);
        };
        board.onSetPointAsValidDestination = function (pointId, on) {
            _this.pointUIs[pointId - 1].setValidDestination(on);
        };
        board.onSetBarAsValidSource = function (playerId, on) {
            getBarUI(playerId).setValidSource(on);
        };
        board.onSetPointAsValidSource = function (pointId, on) {
            _this.pointUIs[pointId - 1].setValidSource(on);
        };
    };
    return BoardUI;
}());
/// <reference path="BoardUI.ts"/>
/// <reference path="../Board.ts"/>
/// <reference path="../DiceUI.ts"/>
/// <reference path="../Enums.ts"/>
/// <reference path="../Game.ts"/>
/// <reference path="../StatusUI.ts"/>
var GameUI = (function () {
    function GameUI(containerElementId, board) {
        var container = document.getElementById(containerElementId);
        container.className = 'game-container';
        Utils.removeAllChildren(container);
        this.boardUI = new BoardUI(containerElementId, board);
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
}());
/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="DiceRollGenerator.ts"/>
/// <reference path="Game.ts"/>
/// <reference path="UI/GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>
var Backgammon = (function () {
    function Backgammon(containerId, blackIsComputer, redIsComputer) {
        if (blackIsComputer === void 0) { blackIsComputer = false; }
        if (redIsComputer === void 0) { redIsComputer = false; }
        var board = new Board();
        var ui = new GameUI(containerId, board);
        board.initialise();
        var dice = new Dice(new DiceRollGenerator(), ui.blackDiceUI, ui.redDiceUI);
        var statusLogger = new StatusLogger(ui.statusUI);
        var game = new Game(board, dice, statusLogger, [blackIsComputer, redIsComputer]);
        // TODO: UI trigger game to begin
        dice.rollToStart(statusLogger, function (successfulPlayer) {
            game.begin(successfulPlayer);
        });
    }
    return Backgammon;
}());
