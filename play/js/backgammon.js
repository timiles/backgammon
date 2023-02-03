var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Enums", ["require", "exports"], function (require, exports) {
    "use strict";
    (function (PlayerId) {
        PlayerId[PlayerId["BLACK"] = 0] = "BLACK";
        PlayerId[PlayerId["WHITE"] = 1] = "WHITE";
    })(exports.PlayerId || (exports.PlayerId = {}));
    var PlayerId = exports.PlayerId;
    (function (PointId) {
        PointId[PointId["HOME"] = 0] = "HOME";
        PointId[PointId["BAR"] = 25] = "BAR";
    })(exports.PointId || (exports.PointId = {}));
    var PointId = exports.PointId;
});
define("BoardComponents/CheckerContainer", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.CheckerContainer = CheckerContainer;
});
define("BoardComponents/Bar", ["require", "exports", "BoardComponents/CheckerContainer", "Enums"], function (require, exports, CheckerContainer_1, Enums_1) {
    "use strict";
    var Bar = (function (_super) {
        __extends(Bar, _super);
        function Bar() {
            _super.call(this, Enums_1.PointId.BAR);
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
    }(CheckerContainer_1.CheckerContainer));
    exports.Bar = Bar;
});
define("BoardComponents/Home", ["require", "exports", "BoardComponents/CheckerContainer", "Enums"], function (require, exports, CheckerContainer_2, Enums_2) {
    "use strict";
    var Home = (function (_super) {
        __extends(Home, _super);
        function Home() {
            _super.call(this, Enums_2.PointId.HOME);
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
    }(CheckerContainer_2.CheckerContainer));
    exports.Home = Home;
});
define("BoardComponents/Point", ["require", "exports", "BoardComponents/CheckerContainer"], function (require, exports, CheckerContainer_3) {
    "use strict";
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
    }(CheckerContainer_3.CheckerContainer));
    exports.Point = Point;
});
define("DiceComponents/Die", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.Die = Die;
});
define("DiceComponents/DiceRollGenerator", ["require", "exports"], function (require, exports) {
    "use strict";
    var DiceRollGenerator = (function () {
        function DiceRollGenerator() {
        }
        DiceRollGenerator.prototype.generateDiceRoll = function () {
            return Math.floor(Math.random() * 6) + 1;
        };
        return DiceRollGenerator;
    }());
    exports.DiceRollGenerator = DiceRollGenerator;
});
define("StatusLogger", ["require", "exports"], function (require, exports) {
    "use strict";
    var StatusLogger = (function () {
        function StatusLogger() {
        }
        StatusLogger.prototype.logInfo = function (info) {
            if (this.onLogInfo) {
                this.onLogInfo(info);
            }
        };
        return StatusLogger;
    }());
    exports.StatusLogger = StatusLogger;
});
define("DiceComponents/Dice", ["require", "exports", "DiceComponents/Die", "Enums"], function (require, exports, Die_1, Enums_3) {
    "use strict";
    var Dice = (function () {
        function Dice(diceRollGenerator) {
            this.diceRollGenerator = diceRollGenerator;
        }
        Dice.prototype.rollToStart = function (statusLogger, onSuccess) {
            var _this = this;
            var die1 = new Die_1.Die(this.diceRollGenerator.generateDiceRoll());
            var die2 = new Die_1.Die(this.diceRollGenerator.generateDiceRoll());
            if (this.onSetStartingDiceRoll) {
                this.onSetStartingDiceRoll(Enums_3.PlayerId.BLACK, die1);
                this.onSetStartingDiceRoll(Enums_3.PlayerId.WHITE, die2);
            }
            statusLogger.logInfo("BLACK rolls " + die1.value);
            statusLogger.logInfo("WHITE rolls " + die2.value);
            if (die1.value === die2.value) {
                statusLogger.logInfo('DRAW! Roll again');
                setTimeout(function () { _this.rollToStart(statusLogger, onSuccess); }, 1000);
            }
            else {
                var successfulPlayerId_1 = die1.value > die2.value ? Enums_3.PlayerId.BLACK : Enums_3.PlayerId.WHITE;
                statusLogger.logInfo(Enums_3.PlayerId[successfulPlayerId_1] + " wins the starting roll");
                setTimeout(function () {
                    _this.die1 = die1;
                    _this.die2 = die2;
                    if (_this.onSetDiceRolls) {
                        _this.onSetDiceRolls(successfulPlayerId_1, die1, die2);
                    }
                    if (_this.onSetActive) {
                        _this.onSetActive(successfulPlayerId_1, true);
                    }
                    onSuccess(successfulPlayerId_1);
                }, 1000);
            }
        };
        Dice.prototype.roll = function (playerId) {
            this.die1 = new Die_1.Die(this.diceRollGenerator.generateDiceRoll());
            this.die2 = new Die_1.Die(this.diceRollGenerator.generateDiceRoll());
            var isDouble = (this.die1.value === this.die2.value);
            if (isDouble) {
                this.die1.remainingUses = 2;
                this.die2.remainingUses = 2;
            }
            if (this.onSetDiceRolls) {
                this.onSetDiceRolls(playerId, this.die1, this.die2);
            }
            if (this.onSetActive) {
                this.onSetActive(playerId, true);
                var otherPlayerId = playerId === Enums_3.PlayerId.BLACK ? Enums_3.PlayerId.WHITE : Enums_3.PlayerId.BLACK;
                this.onSetActive(otherPlayerId, false);
            }
        };
        return Dice;
    }());
    exports.Dice = Dice;
});
define("Move", ["require", "exports", "Enums"], function (require, exports, Enums_4) {
    "use strict";
    var Move = (function () {
        function Move(playerId, sourcePointId, numberOfPointsToMove) {
            this.playerId = playerId;
            this.sourcePointId = sourcePointId;
            this.numberOfPointsToMove = numberOfPointsToMove;
        }
        Move.prototype.getDestinationPointId = function () {
            switch (this.playerId) {
                case Enums_4.PlayerId.BLACK: {
                    if (this.sourcePointId === Enums_4.PointId.BAR) {
                        return this.numberOfPointsToMove;
                    }
                    var destinationPointId = this.sourcePointId + this.numberOfPointsToMove;
                    if (destinationPointId > 24) {
                        // bearing off
                        return Enums_4.PointId.HOME;
                    }
                    return destinationPointId;
                }
                case Enums_4.PlayerId.WHITE: {
                    if (this.sourcePointId === Enums_4.PointId.BAR) {
                        return Enums_4.PointId.BAR - this.numberOfPointsToMove;
                    }
                    var destinationPointId = this.sourcePointId - this.numberOfPointsToMove;
                    if (destinationPointId < 1) {
                        // bearing off
                        return Enums_4.PointId.HOME;
                    }
                    return destinationPointId;
                }
                default: throw "Unknown playerId: " + this.playerId;
            }
        };
        return Move;
    }());
    exports.Move = Move;
});
define("Analysis/PossibleGo", ["require", "exports"], function (require, exports) {
    "use strict";
    var PossibleGo = (function () {
        function PossibleGo(moves, resultingBoard) {
            this.moves = moves;
            this.resultingBoard = resultingBoard;
        }
        return PossibleGo;
    }());
    exports.PossibleGo = PossibleGo;
});
define("Analysis/BoardAnalyser", ["require", "exports", "BoardComponents/Board", "Enums", "Move", "Analysis/PossibleGo"], function (require, exports, Board_1, Enums_5, Move_1, PossibleGo_1) {
    "use strict";
    var BoardAnalyser = (function () {
        function BoardAnalyser() {
        }
        BoardAnalyser.isRace = function (board) {
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
        BoardAnalyser.getPossibleGoes = function (board, playerId, die1Value, die2Value) {
            var possibleGoes = new Array();
            // 1. double number thrown.
            if (die1Value === die2Value) {
                var points_1 = die1Value;
                var testBoard = new Array(4);
                var numOfMoves = 0;
                // 25: include bar
                for (var i1 = 1; i1 <= 25; i1++) {
                    testBoard[0] = BoardAnalyser.clone(board);
                    var move1 = new Move_1.Move(playerId, i1, points_1);
                    if (!testBoard[0].move(move1)) {
                        continue;
                    }
                    possibleGoes.push(new PossibleGo_1.PossibleGo([move1], testBoard[0]));
                    for (var i2 = 1; i2 <= 25; i2++) {
                        testBoard[1] = BoardAnalyser.clone(testBoard[0]);
                        var move2 = new Move_1.Move(playerId, i2, points_1);
                        if (!testBoard[1].move(move2)) {
                            continue;
                        }
                        possibleGoes.push(new PossibleGo_1.PossibleGo([move1, move2], testBoard[1]));
                        for (var i3 = 1; i3 <= 25; i3++) {
                            testBoard[2] = BoardAnalyser.clone(testBoard[1]);
                            var move3 = new Move_1.Move(playerId, i3, points_1);
                            if (!testBoard[2].move(move3)) {
                                continue;
                            }
                            possibleGoes.push(new PossibleGo_1.PossibleGo([move1, move2, move3], testBoard[2]));
                            for (var i4 = 1; i4 <= 25; i4++) {
                                testBoard[3] = BoardAnalyser.clone(testBoard[2]);
                                var move4 = new Move_1.Move(playerId, i4, points_1);
                                if (testBoard[3].move(move4)) {
                                    possibleGoes.push(new PossibleGo_1.PossibleGo([move1, move2, move3, move4], testBoard[3]));
                                }
                            }
                        }
                    }
                }
                return BoardAnalyser.getPossibleGoesThatUseMostDice(possibleGoes);
            }
            // 2. non-double thrown.
            var points = [die1Value, die2Value];
            for (var startPoint1 = 1; startPoint1 <= 25; startPoint1++) {
                for (var die = 0; die < 2; die++) {
                    var testBoard1 = BoardAnalyser.clone(board);
                    var move1 = new Move_1.Move(playerId, startPoint1, points[die]);
                    if (testBoard1.move(move1)) {
                        if (!BoardAnalyser.canMove(testBoard1, playerId, points[(die + 1) % 2])) {
                            possibleGoes.push(new PossibleGo_1.PossibleGo([move1], BoardAnalyser.clone(testBoard1)));
                            continue;
                        }
                        // else 
                        for (var startPoint2 = 1; startPoint2 <= 25; startPoint2++) {
                            var testBoard2 = BoardAnalyser.clone(testBoard1);
                            var move2 = new Move_1.Move(playerId, startPoint2, points[(die + 1) % 2]);
                            if (testBoard2.move(move2)) {
                                possibleGoes.push(new PossibleGo_1.PossibleGo([move1, move2], BoardAnalyser.clone(testBoard2)));
                                continue;
                            }
                        }
                    }
                }
            }
            return BoardAnalyser.getPossibleGoesThatUseMostDice(possibleGoes);
        };
        BoardAnalyser.clone = function (source) {
            var clone = new Board_1.Board();
            var layout = new Array();
            for (var pointId = 0; pointId < 26; pointId++) {
                layout[pointId] = [source.checkerContainers[pointId].checkers[Enums_5.PlayerId.BLACK], source.checkerContainers[pointId].checkers[Enums_5.PlayerId.WHITE]];
            }
            clone.initialise(layout);
            return clone;
        };
        BoardAnalyser.canMove = function (board, playerId, points) {
            // 25: include bar
            for (var startingPoint = 1; startingPoint <= 25; startingPoint++) {
                if (board.isLegalMove(new Move_1.Move(playerId, startingPoint, points))) {
                    return true;
                }
            }
            return false;
        };
        BoardAnalyser.getPossibleGoesThatUseMostDice = function (possibleGoes) {
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
        return BoardAnalyser;
    }());
    exports.BoardAnalyser = BoardAnalyser;
});
define("Players/Player", ["require", "exports"], function (require, exports) {
    "use strict";
    var Player = (function () {
        function Player(playerId, board) {
            this.playerId = playerId;
            this.board = board;
        }
        return Player;
    }());
    exports.Player = Player;
});
define("Players/ComputerPlayer", ["require", "exports", "Analysis/BoardAnalyser", "Enums", "Players/Player"], function (require, exports, BoardAnalyser_1, Enums_6, Player_1) {
    "use strict";
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
            var possibleGoes = BoardAnalyser_1.BoardAnalyser.getPossibleGoes(this.board, this.playerId, die1Value, die2Value);
            if (possibleGoes.length === 0) {
                console.info('No possible go');
                return null;
            }
            var maxScore = 0;
            var bestPossibleGo;
            for (var i = 0; i < possibleGoes.length; i++) {
                var score = this.evaluateBoard(possibleGoes[i].resultingBoard);
                // greater than or equal: bias towards further on moves
                if (score >= maxScore) {
                    maxScore = score;
                    bestPossibleGo = possibleGoes[i];
                }
            }
            return bestPossibleGo;
        };
        ComputerPlayer.prototype.evaluateBoard = function (resultingBoard) {
            return this.evaluateSafety(resultingBoard) * this.safetyFactor +
                this.evaluateClustering(resultingBoard) * this.clusteringFactor +
                this.evaluateOffensive(resultingBoard) * this.offensiveFactor;
        };
        // return score of how safe the checkers are.
        ComputerPlayer.prototype.evaluateSafety = function (resultingBoard) {
            // if the game is a race, safety is irrelevant
            if (BoardAnalyser_1.BoardAnalyser.isRace(this.board)) {
                return 0;
            }
            var score = 100;
            var direction = (this.playerId === Enums_6.PlayerId.BLACK) ? 1 : -1;
            var homePointId = (this.playerId === Enums_6.PlayerId.BLACK) ? 25 : 0;
            for (var pointId = 1; pointId <= 24; pointId++) {
                if (resultingBoard.checkerContainers[pointId].checkers[this.playerId] === 1) {
                    // TODO: factor safety on prob of opp hitting this piece
                    var distanceOfBlotToHome = (homePointId - pointId) * direction;
                    var relativePenaltyOfLosingThisBlot = distanceOfBlotToHome / 24;
                    score *= (.75 * relativePenaltyOfLosingThisBlot);
                }
            }
            return score;
        };
        // return score of how clustered the towers are.
        ComputerPlayer.prototype.evaluateClustering = function (resultingBoard) {
            var score = 0;
            // number of towers
            // proximity of towers
            return score;
        };
        // offensive: putting opponent onto bar
        ComputerPlayer.prototype.evaluateOffensive = function (resultingBoard) {
            var otherPlayerId = (this.playerId + 1) % 2;
            switch (resultingBoard.checkerContainers[Enums_6.PointId.BAR].checkers[otherPlayerId]) {
                case 0: return 0;
                case 1: return 65;
                default: return 100;
            }
        };
        return ComputerPlayer;
    }(Player_1.Player));
    exports.ComputerPlayer = ComputerPlayer;
});
define("Players/HumanPlayer", ["require", "exports", "Players/Player"], function (require, exports, Player_2) {
    "use strict";
    var HumanPlayer = (function (_super) {
        __extends(HumanPlayer, _super);
        function HumanPlayer() {
            _super.apply(this, arguments);
        }
        return HumanPlayer;
    }(Player_2.Player));
    exports.HumanPlayer = HumanPlayer;
});
define("Game", ["require", "exports", "BoardComponents/Bar", "BoardComponents/Home", "BoardComponents/Point", "Players/ComputerPlayer", "Players/HumanPlayer", "Move", "Enums"], function (require, exports, Bar_1, Home_1, Point_1, ComputerPlayer_1, HumanPlayer_1, Move_2, Enums_7) {
    "use strict";
    var Game = (function () {
        function Game(board, dice, statusLogger, isComputerPlayer) {
            var _this = this;
            if (isComputerPlayer === void 0) { isComputerPlayer = [false, false]; }
            this.board = board;
            this.dice = dice;
            this.statusLogger = statusLogger;
            this.players = new Array(2);
            for (var _i = 0, _a = [Enums_7.PlayerId.BLACK, Enums_7.PlayerId.WHITE]; _i < _a.length; _i++) {
                var playerId = _a[_i];
                this.players[playerId] = (isComputerPlayer[playerId]) ? new ComputerPlayer_1.ComputerPlayer(playerId, this.board) : new HumanPlayer_1.HumanPlayer(playerId, this.board);
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
                if (!(checkerContainer instanceof Home_1.Home) && (checkerContainer.checkers[_this.currentPlayerId] > 0)) {
                    for (var _i = 0, _a = [_this.dice.die1, _this.dice.die2]; _i < _a.length; _i++) {
                        var die = _a[_i];
                        if (die.remainingUses > 0) {
                            _this.board.checkIfValidDestination(new Move_2.Move(_this.currentPlayerId, checkerContainer.pointId, die.value));
                        }
                    }
                }
            };
            this.board.onPointSelected = function (pointId) {
                console.log(pointId);
                console.log(_this.currentPlayerId);
                var checkerContainer = _this.board.checkerContainers[pointId];
                
                if (_this.currentSelectedCheckerContainer == undefined) {
                    if (checkerContainer.checkers[_this.currentPlayerId] == 0) {
                        // if no pieces here, exit
                        return;
                    }
                    var canUseDie = function (die) {
                        var move = new Move_2.Move(_this.currentPlayerId, checkerContainer.pointId, die.value);
                        return (die.remainingUses > 0 && _this.board.isLegalMove(move));
                    };
                    var canBearOff = function (die) {
                        var move = new Move_2.Move(_this.currentPlayerId, checkerContainer.pointId, die.value);
                        return (die.remainingUses > 0 &&
                            move.getDestinationPointId() === Enums_7.PointId.HOME &&
                            _this.board.isLegalMove(move));
                    };
                    var canUseDie1 = canUseDie(_this.dice.die1);
                    var canUseDie2 = canUseDie(_this.dice.die2);
                    // if can use one die but not the other, or if it's doubles, or if both bear off home, just play it
                    if ((canUseDie1 != canUseDie2) ||
                        (_this.dice.die1.value === _this.dice.die2.value) ||
                        (canBearOff(_this.dice.die1) && canBearOff(_this.dice.die2))) {
                        if (canUseDie1) {
                            _this.board.move(new Move_2.Move(_this.currentPlayerId, checkerContainer.pointId, _this.dice.die1.value));
                            _this.dice.die1.decrementRemainingUses();
                            _this.evaluateBoard();
                        }
                        else if (canUseDie2) {
                            _this.board.move(new Move_2.Move(_this.currentPlayerId, checkerContainer.pointId, _this.dice.die2.value));
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
                        if (checkerContainer instanceof Point_1.Point) {
                            checkerContainer.setSelected(true);
                        }
                        else if (checkerContainer instanceof Bar_1.Bar) {
                            checkerContainer.setSelected(_this.currentPlayerId, true);
                        }
                        _this.currentSelectedCheckerContainer = checkerContainer;
                        _this.evaluateBoard();
                    }
                }
                else if (checkerContainer.pointId === _this.currentSelectedCheckerContainer.pointId) {
                    if (_this.currentSelectedCheckerContainer instanceof Point_1.Point) {
                        _this.currentSelectedCheckerContainer.setSelected(false);
                    }
                    _this.currentSelectedCheckerContainer = undefined;
                    _this.evaluateBoard();
                }
                else {
                    var useDieIfPossible = function (die) {
                        var move = new Move_2.Move(_this.currentPlayerId, _this.currentSelectedCheckerContainer.pointId, die.value);
                        var destinationPointId = move.getDestinationPointId();
                        if (destinationPointId !== checkerContainer.pointId) {
                            return false;
                        }
                        _this.board.move(move);
                        die.decrementRemainingUses();
                        if (_this.currentSelectedCheckerContainer instanceof Point_1.Point) {
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
                return (die.remainingUses > 0) && _this.board.isLegalMove(new Move_2.Move(_this.currentPlayerId, pointId, die.value));
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
            if (this.board.checkerContainers[Enums_7.PointId.HOME].checkers[this.currentPlayerId] === 15) {
                this.statusLogger.logInfo(Enums_7.PlayerId[this.currentPlayerId] + " WINS!");
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
            if (this.players[this.currentPlayerId] instanceof ComputerPlayer_1.ComputerPlayer) {
                var computerPlayer = this.players[this.currentPlayerId];
                var bestPossibleGo = computerPlayer.getBestPossibleGo(this.dice.die1.value, this.dice.die2.value);
                if (bestPossibleGo) {
                    for (var moveNumber = 0; moveNumber < bestPossibleGo.moves.length; moveNumber++) {
                        var move = bestPossibleGo.moves[moveNumber];
                        this.board.move(move);
                    }
                }
                setTimeout(function () {
                    _this.switchPlayer();
                    _this.dice.roll(_this.currentPlayerId);
                    _this.evaluateBoard();
                    _this.switchPlayerIfNoValidMovesRemain();
                }, 500);
            }
        };
        Game.getOtherPlayerId = function (player) {
            return player === Enums_7.PlayerId.BLACK ? Enums_7.PlayerId.WHITE : Enums_7.PlayerId.BLACK;
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
                            (_this.board.isLegalMove(new Move_2.Move(_this.currentPlayerId, pointId, die.value)))) {
                            return true;
                        }
                    }
                }
                return false;
            };
            this.board.checkerContainers[Enums_7.PointId.BAR].setValidSource(this.currentPlayerId, isValidSource(Enums_7.PointId.BAR));
            for (var i = 1; i <= 24; i++) {
                this.board.checkerContainers[i].setValidSource(isValidSource(i));
            }
        };
        Game.prototype.logCurrentPlayer = function () {
            this.statusLogger.logInfo(Enums_7.PlayerId[this.currentPlayerId] + " to move");
        };
        return Game;
    }());
    exports.Game = Game;
});
define("BoardComponents/Board", ["require", "exports", "Enums", "Game", "BoardComponents/Bar", "BoardComponents/Home", "BoardComponents/Point"], function (require, exports, Enums_8, Game_1, Bar_2, Home_2, Point_2) {
    "use strict";
    var Board = (function () {
        function Board() {
            var _this = this;
            this.checkerContainers = new Array(26);
            var home = new Home_2.Home();
            home.onIncrement = function (playerId, count) {
                if (_this.onCheckerCountChanged) {
                    _this.onCheckerCountChanged(Enums_8.PointId.HOME, playerId, count);
                }
            };
            home.onSetValidDestination = function (playerId, on) {
                if (_this.onSetHomeAsValidDestination) {
                    _this.onSetHomeAsValidDestination(playerId, on);
                }
            };
            this.checkerContainers[Enums_8.PointId.HOME] = home;
            var createPoint = function (pointId) {
                var point = new Point_2.Point(pointId);
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
            var bar = new Bar_2.Bar();
            bar.onCheckerCountChanged = function (playerId, count) {
                if (_this.onCheckerCountChanged) {
                    _this.onCheckerCountChanged(Enums_8.PointId.BAR, playerId, count);
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
            this.checkerContainers[Enums_8.PointId.BAR] = bar;
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
                for (var _i = 0, _a = [Enums_8.PlayerId.BLACK, Enums_8.PlayerId.WHITE]; _i < _a.length; _i++) {
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
        Board.prototype.isLegalMove = function (move) {
            // case: there is no counter to move: fail
            if (this.checkerContainers[move.sourcePointId].checkers[move.playerId] == 0) {
                // console.info('no counter at ' + sourcePointId);
                return false;
            }
            // case: there is a counter on the bar, and this is not it
            if ((move.sourcePointId != Enums_8.PointId.BAR) && (this.checkerContainers[Enums_8.PointId.BAR].checkers[move.playerId] > 0)) {
                // console.info('must move counter off bar first');
                return false;
            }
            // case: bearing off
            var destinationPointId = move.getDestinationPointId();
            if (destinationPointId === Enums_8.PointId.HOME) {
                // check that there are no checkers outside of home board. (BAR has already been checked above)
                var startingPointOfOuterBoard = (move.playerId === Enums_8.PlayerId.BLACK) ? 1 : 24;
                var totalPointsOfOuterBoard = 18;
                var direction = (move.playerId === Enums_8.PlayerId.BLACK) ? 1 : -1;
                for (var offset = 0; offset < totalPointsOfOuterBoard; offset++) {
                    if (this.checkerContainers[startingPointOfOuterBoard + (direction * offset)].checkers[move.playerId] > 0) {
                        return false;
                    }
                }
                // check that there are no checkers more deserving of this dice roll
                var actualDestinationPointId = move.sourcePointId + (direction * move.numberOfPointsToMove);
                // if it's dead on, we're fine.
                if (actualDestinationPointId === 0 || actualDestinationPointId === 25) {
                    return true;
                }
                var startingPointOfHomeBoard = (move.playerId === Enums_8.PlayerId.BLACK) ? 18 : 6;
                for (var homeBoardPointId = startingPointOfHomeBoard; homeBoardPointId !== move.sourcePointId; homeBoardPointId += direction) {
                    if (this.checkerContainers[homeBoardPointId].checkers[move.playerId] > 0) {
                        // if we find a checker on a further out point, sourcePointId is not valid
                        return false;
                    }
                }
                return true;
            }
            var otherPlayerId = Game_1.Game.getOtherPlayerId(move.playerId);
            // case: there is a counter, but opponent blocks the end pip
            if (this.checkerContainers[destinationPointId].checkers[otherPlayerId] >= 2) {
                // console.info('point is blocked');
                return false;
            }
            return true;
        };
        Board.prototype.move = function (move) {
            if (!this.isLegalMove(move)) {
                return false;
            }
            var destinationPointId = move.getDestinationPointId();
            var otherPlayerId = Game_1.Game.getOtherPlayerId(move.playerId);
            if (destinationPointId !== Enums_8.PointId.HOME &&
                this.checkerContainers[destinationPointId].checkers[otherPlayerId] == 1) {
                this.decrement(otherPlayerId, destinationPointId);
                this.increment(otherPlayerId, Enums_8.PointId.BAR);
            }
            this.decrement(move.playerId, move.sourcePointId);
            this.increment(move.playerId, destinationPointId);
            return true;
        };
        Board.prototype.checkIfValidDestination = function (move) {
            if (this.isLegalMove(move)) {
                var destinationPointId = move.getDestinationPointId();
                if (destinationPointId === Enums_8.PointId.HOME) {
                    this.checkerContainers[Enums_8.PointId.HOME].setValidDestination(move.playerId, true);
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
            this.checkerContainers[Enums_8.PointId.HOME].setValidDestination(Enums_8.PlayerId.BLACK, false);
            this.checkerContainers[Enums_8.PointId.HOME].setValidDestination(Enums_8.PlayerId.WHITE, false);
        };
        return Board;
    }());
    exports.Board = Board;
});
define("UI/Utils", ["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.Utils = Utils;
});
define("UI/CheckerContainerUI", ["require", "exports", "Enums", "UI/Utils"], function (require, exports, Enums_9, Utils_1) {
    "use strict";
    var CheckerContainerUI = (function () {
        function CheckerContainerUI(containerType, isTopSide) {
            var _this = this;
            this.containerDiv = document.createElement('div');
            var side = (isTopSide ? 'top' : 'bottom');
            containerType == 'bar' && (side = null);
            containerType == 'home' && (side = null);
            this.containerDiv.className = "checker-container checker-container-" + side + " " + containerType;
            this.containerDiv.onclick = function () { _this.onSelected(); };
        }
        CheckerContainerUI.prototype.setCheckers = function (player, count) {
            Utils_1.Utils.removeAllChildren(this.containerDiv);
            var $containerDiv = $(this.containerDiv);
            var className = Enums_9.PlayerId[player].toLowerCase();
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
    exports.CheckerContainerUI = CheckerContainerUI;
});
define("UI/BarUI", ["require", "exports", "Enums", "UI/CheckerContainerUI"], function (require, exports, Enums_10, CheckerContainerUI_1) {
    "use strict";
    var BarUI = (function (_super) {
        __extends(BarUI, _super);
        function BarUI(player) {
            var _this = this;
            _super.call(this, 'bar', player === Enums_10.PlayerId.WHITE);
            this.containerDiv.onmouseover = function () { _this.onInspected(true); };
            this.containerDiv.onmouseout = function () { _this.onInspected(false); };
        }
        return BarUI;
    }(CheckerContainerUI_1.CheckerContainerUI));
    exports.BarUI = BarUI;
});
define("UI/HomeUI", ["require", "exports", "Enums", "UI/CheckerContainerUI"], function (require, exports, Enums_11, CheckerContainerUI_2) {
    "use strict";
    var HomeUI = (function (_super) {
        __extends(HomeUI, _super);
        function HomeUI(player) {
            _super.call(this, 'home', player === Enums_11.PlayerId.BLACK);
        }
        return HomeUI;
    }(CheckerContainerUI_2.CheckerContainerUI));
    exports.HomeUI = HomeUI;
});
define("UI/PointUI", ["require", "exports", "UI/CheckerContainerUI"], function (require, exports, CheckerContainerUI_3) {
    "use strict";
    var PointUI = (function (_super) {
        __extends(PointUI, _super);
        function PointUI(colour, isTopSide) {
            var _this = this;
            _super.call(this, "point-" + colour, isTopSide);
            this.containerDiv.onmouseover = function () { _this.onInspected(true); };
            this.containerDiv.onmouseout = function () { _this.onInspected(false); };
        }
        return PointUI;
    }(CheckerContainerUI_3.CheckerContainerUI));
    exports.PointUI = PointUI;
});
define("UI/BoardUI", ["require", "exports", "Enums", "UI/BarUI", "UI/HomeUI", "UI/PointUI", "UI/Utils"], function (require, exports, Enums_12, BarUI_1, HomeUI_1, PointUI_1, Utils_2) {
    "use strict";
    var BoardUI = (function () {
        function BoardUI(gameContainerId) {
            this.containerDiv = document.createElement('div');
            Utils_2.Utils.removeAllChildren(this.containerDiv);
            this.containerDiv.className = 'board';
            this.blackHomeUI = new HomeUI_1.HomeUI(Enums_12.PlayerId.BLACK);
            this.blackHomeUI.containerDiv.id = gameContainerId + "_blackhome";
            this.redHomeUI = new HomeUI_1.HomeUI(Enums_12.PlayerId.WHITE);
            this.redHomeUI.containerDiv.id = gameContainerId + "_redhome";
            this.pointUIs = new Array(24);
            for (var i = 0; i < this.pointUIs.length; i++) {
                var colour = (i % 2 == 0) ? 'black' : 'white';
                var isTopSide = i >= 12;
                this.pointUIs[i] = new PointUI_1.PointUI(colour, isTopSide);
                this.pointUIs[i].containerDiv.id = gameContainerId + "_point" + (i + 1);
            }
            this.blackBarUI = new BarUI_1.BarUI(Enums_12.PlayerId.BLACK);
            this.redBarUI = new BarUI_1.BarUI(Enums_12.PlayerId.WHITE);
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
    }());
    exports.BoardUI = BoardUI;
});
define("UI/DiceUI", ["require", "exports", "UI/Utils", "Enums"], function (require, exports, Utils_3, Enums_13) {
    "use strict";
    var DiceUI = (function () {
        function DiceUI(player) {
            this.containerDiv = document.createElement('div');
            this.containerDiv.className = "dice-container dice-container-" + Enums_13.PlayerId[player].toLowerCase();
        }
        DiceUI.prototype.setStartingDiceRoll = function (die) {
            Utils_3.Utils.removeAllChildren(this.containerDiv);
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
            Utils_3.Utils.removeAllChildren(this.containerDiv);
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
    exports.DiceUI = DiceUI;
});
define("UI/StatusUI", ["require", "exports", "UI/Utils"], function (require, exports, Utils_4) {
    "use strict";
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
            Utils_4.Utils.highlight(statusP);
        };
        return StatusUI;
    }());
    exports.StatusUI = StatusUI;
});
define("UI/EventBinders", ["require", "exports", "Enums"], function (require, exports, Enums_14) {
    "use strict";
    var EventBinders = (function () {
        function EventBinders() {
        }
        EventBinders.bindGame = function (game, gameUI) {
            EventBinders.bindBoardEvents(game.board, gameUI.boardUI);
            EventBinders.bindDiceEvents(game.dice, gameUI.blackDiceUI, gameUI.redDiceUI);
            EventBinders.bindStatusLoggerEvents(game.statusLogger, gameUI.statusUI);
        };
        EventBinders.bindBoardEvents = function (board, boardUI) {
            // helpers
            var getBarUI = function (playerId) {
                return (playerId === Enums_14.PlayerId.BLACK) ? boardUI.blackBarUI : boardUI.redBarUI;
            };
            var getHomeUI = function (playerId) {
                return (playerId === Enums_14.PlayerId.BLACK) ? boardUI.blackHomeUI : boardUI.redHomeUI;
            };
            // wire up UI events
            boardUI.blackHomeUI.onSelected = function () { return board.onPointSelected(Enums_14.PointId.HOME); };
            boardUI.redHomeUI.onSelected = function () { return board.onPointSelected(Enums_14.PointId.HOME); };
            boardUI.blackBarUI.onInspected = function (on) { return board.onPointInspected(Enums_14.PointId.BAR, on); };
            boardUI.blackBarUI.onSelected = function () { return board.onPointSelected(Enums_14.PointId.BAR); };
            boardUI.redBarUI.onInspected = function (on) { return board.onPointInspected(Enums_14.PointId.BAR, on); };
            boardUI.redBarUI.onSelected = function () { return board.onPointSelected(Enums_14.PointId.BAR); };
            var bindPointUIEvents = function (pointId) {
                var pointUI = boardUI.pointUIs[pointId - 1];
                pointUI.onInspected = function (on) { board.onPointInspected(pointId, on); };
                pointUI.onSelected = function () { board.onPointSelected(pointId); };
            };
            for (var i = 1; i < 25; i++) {
                bindPointUIEvents(i);
            }
            board.onCheckerCountChanged = function (pointId, playerId, count) {
                switch (pointId) {
                    case Enums_14.PointId.HOME: {
                        getHomeUI(playerId).setCheckers(playerId, count);
                        break;
                    }
                    case Enums_14.PointId.BAR: {
                        getBarUI(playerId).setCheckers(playerId, count);
                        break;
                    }
                    default: {
                        boardUI.pointUIs[pointId - 1].setCheckers(playerId, count);
                    }
                }
            };
            board.onSetBarAsSelected = function (playerId, on) {
                getBarUI(playerId).setSelected(on);
            };
            board.onSetPointAsSelected = function (pointId, on) {
                boardUI.pointUIs[pointId - 1].setSelected(on);
            };
            board.onSetHomeAsValidDestination = function (playerId, on) {
                getHomeUI(playerId).setValidDestination(on);
            };
            board.onSetPointAsValidDestination = function (pointId, on) {
                boardUI.pointUIs[pointId - 1].setValidDestination(on);
            };
            board.onSetBarAsValidSource = function (playerId, on) {
                getBarUI(playerId).setValidSource(on);
            };
            board.onSetPointAsValidSource = function (pointId, on) {
                boardUI.pointUIs[pointId - 1].setValidSource(on);
            };
        };
        EventBinders.bindDiceEvents = function (dice, blackDiceUI, redDiceUI) {
            var getDiceUI = function (playerId) {
                switch (playerId) {
                    case Enums_14.PlayerId.BLACK: return blackDiceUI;
                    case Enums_14.PlayerId.WHITE: return redDiceUI;
                    default: throw "Unknown PlayerId: " + playerId;
                }
            };
            dice.onSetStartingDiceRoll = function (playerId, die) { getDiceUI(playerId).setStartingDiceRoll(die); };
            dice.onSetDiceRolls = function (playerId, die1, die2) { getDiceUI(playerId).setDiceRolls(die1, die2); };
            dice.onSetActive = function (playerId, active) { getDiceUI(playerId).setActive(active); };
        };
        EventBinders.bindStatusLoggerEvents = function (statusLogger, statusUI) {
            statusLogger.onLogInfo = function (info) { statusUI.setStatus(info); };
        };
        return EventBinders;
    }());
    exports.EventBinders = EventBinders;
});
define("UI/GameUI", ["require", "exports", "UI/BoardUI", "UI/DiceUI", "Enums", "UI/StatusUI", "UI/EventBinders", "UI/Utils"], function (require, exports, BoardUI_1, DiceUI_1, Enums_15, StatusUI_1, EventBinders_1, Utils_5) {
    "use strict";
    var GameUI = (function () {
        function GameUI(containerElementId, game) {
            var container = document.getElementById(containerElementId);
            container.className = 'game-container';
            Utils_5.Utils.removeAllChildren(container);
            this.boardUI = new BoardUI_1.BoardUI(containerElementId);
            this.blackDiceUI = new DiceUI_1.DiceUI(Enums_15.PlayerId.BLACK);
            this.redDiceUI = new DiceUI_1.DiceUI(Enums_15.PlayerId.WHITE);
            this.statusUI = new StatusUI_1.StatusUI();
            container.appendChild(this.boardUI.containerDiv);
            var sideContainer = document.createElement('div');
            sideContainer.className = 'side-container';
            sideContainer.appendChild(this.blackDiceUI.containerDiv);
            sideContainer.appendChild(this.statusUI.containerDiv);
            sideContainer.appendChild(this.redDiceUI.containerDiv);
            container.appendChild(sideContainer);
            EventBinders_1.EventBinders.bindGame(game, this);
        }
        return GameUI;
    }());
    exports.GameUI = GameUI;
});
define("Backgammon", ["require", "exports", "BoardComponents/Board", "DiceComponents/Dice", "DiceComponents/DiceRollGenerator", "UI/GameUI", "Game", "StatusLogger"], function (require, exports, Board_2, Dice_1, DiceRollGenerator_1, GameUI_1, Game_2, StatusLogger_1) {
    "use strict";
    var Backgammon = (function () {
        function Backgammon(containerId, blackIsComputer, redIsComputer) {
            if (blackIsComputer === void 0) { blackIsComputer = false; }
            if (redIsComputer === void 0) { redIsComputer = false; }
            var board = new Board_2.Board();
            var dice = new Dice_1.Dice(new DiceRollGenerator_1.DiceRollGenerator());
            var statusLogger = new StatusLogger_1.StatusLogger();
            var game = new Game_2.Game(board, dice, statusLogger, [blackIsComputer, redIsComputer]);
            var ui = new GameUI_1.GameUI(containerId, game);
            board.initialise();
            // TODO: UI trigger game to begin
            dice.rollToStart(statusLogger, function (successfulPlayer) {
                game.begin(successfulPlayer);
            });
        }
        return Backgammon;
    }());
    exports.Backgammon = Backgammon;
});
