/// <reference path="Board.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="ComputerPlayer.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="HumanPlayer.ts"/>
/// <reference path="Player.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>

class Game {

    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;

    currentPlayerId: PlayerId;
    players: Player[];
    currentSelectedCheckerContainer: CheckerContainer;

    constructor(gameUI: GameUI, board: Board, dice: Dice, statusLogger: StatusLogger, currentPlayerId: PlayerId, isComputerPlayer = [false, false]) {

        this.board = board;
        this.dice = dice;
        this.statusLogger = statusLogger;
        this.currentPlayerId = currentPlayerId;

        this.players = new Array<Player>(2);
        for (let playerId of [PlayerId.BLACK, PlayerId.RED]) {
            this.players[playerId] = (isComputerPlayer[playerId]) ? new ComputerPlayer(playerId, this.board) : new HumanPlayer(playerId, this.board);
        }

        // helpers
        let getBarUI = (playerId: PlayerId): BarUI => {
            return (playerId === PlayerId.BLACK) ? gameUI.boardUI.blackBarUI : gameUI.boardUI.redBarUI;
        }
        let getHomeUI = (playerId: PlayerId): HomeUI => {
            return (playerId === PlayerId.BLACK) ? gameUI.boardUI.blackHomeUI : gameUI.boardUI.redHomeUI;
        }

        // wire up UI events
        gameUI.boardUI.blackHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        gameUI.boardUI.redHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        gameUI.boardUI.blackBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        gameUI.boardUI.blackBarUI.onSelected = () => board.onPointSelected(PointId.BAR);
        gameUI.boardUI.redBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        gameUI.boardUI.redBarUI.onSelected = () => board.onPointSelected(PointId.BAR);

        let bindPointUIEvents = (pointId: number): void => {
            let pointUI = gameUI.boardUI.pointUIs[pointId - 1];
            pointUI.onInspected = (on: boolean) => { board.onPointInspected(pointId, on); };
            pointUI.onSelected = () => { board.onPointSelected(pointId); };
        }
        for (let i = 1; i < 25; i++) {
            bindPointUIEvents(i);
        }

        board.onCheckerCountChanged = (pointId: number, playerId: PlayerId, count: number) => {
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
                    gameUI.boardUI.pointUIs[pointId - 1].setCheckers(playerId, count);
                }
            }
        };
        board.onSetBarAsSelected = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setSelected(on);
        };
        board.onSetPointAsSelected = (pointId: number, on: boolean) => {
            gameUI.boardUI.pointUIs[pointId - 1].setSelected(on);
        };
        board.onSetHomeAsValidDestination = (playerId: PlayerId, on: boolean) => {
            getHomeUI(playerId).setValidDestination(on);
        };
        board.onSetPointAsValidDestination = (pointId: number, on: boolean) => {
            gameUI.boardUI.pointUIs[pointId - 1].setValidDestination(on);
        };
        board.onSetBarAsValidSource = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setValidSource(on);
        };
        board.onSetPointAsValidSource = (pointId: number, on: boolean) => {
            gameUI.boardUI.pointUIs[pointId - 1].setValidSource(on);
        };


        this.board.onPointInspected = (pointId: number, on: boolean) => {
            if (this.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }

            if (!on) {
                this.board.removeAllHighlights();
                return;
            }

            let checkerContainer = this.board.checkerContainers[pointId];
            if (!(checkerContainer instanceof Home) && (checkerContainer.checkers[this.currentPlayerId] > 0)) {
                for (let die of [this.dice.die1, this.dice.die2]) {
                    if (die.remainingUses > 0) {
                        this.board.checkIfValidDestination(this.currentPlayerId, checkerContainer.pointId, die.value);
                    }
                }
            }
        };

        this.board.onPointSelected = (pointId: number) => {
            let checkerContainer = this.board.checkerContainers[pointId];
            if (this.currentSelectedCheckerContainer == undefined) {
                if (checkerContainer.checkers[this.currentPlayerId] == 0) {
                    // if no pieces here, exit
                    return;
                }

                let canUseDie = (die: Die): boolean => {
                    return (die.remainingUses > 0 &&
                        this.board.isLegalMove(this.currentPlayerId, checkerContainer.pointId, die.value));
                }

                let canBearOff = (die: Die): boolean => {
                    return (die.remainingUses > 0 &&
                        Board.getDestinationPointId(this.currentPlayerId, checkerContainer.pointId, die.value) === PointId.HOME &&
                        this.board.isLegalMove(this.currentPlayerId, checkerContainer.pointId, die.value));
                }

                let canUseDie1 = canUseDie(this.dice.die1);
                let canUseDie2 = canUseDie(this.dice.die2);

                // if can use one die but not the other, or if it's doubles, or if both bear off home, just play it
                if ((canUseDie1 != canUseDie2) ||
                    (this.dice.die1.value === this.dice.die2.value) ||
                    (canBearOff(this.dice.die1) && canBearOff(this.dice.die2))) {
                    if (canUseDie1) {
                        this.board.move(this.currentPlayerId, checkerContainer.pointId, this.dice.die1.value);
                        this.dice.die1.decrementRemainingUses();
                        this.evaluateBoard();
                    }
                    else if (canUseDie2) {
                        this.board.move(this.currentPlayerId, checkerContainer.pointId, this.dice.die2.value);
                        this.dice.die2.decrementRemainingUses();
                        this.evaluateBoard();
                    }

                    this.switchPlayerIfNoValidMovesRemain();

                    // reinspect point
                    if (this.board.onPointInspected) {
                        this.board.onPointInspected(checkerContainer.pointId, false);
                        this.board.onPointInspected(checkerContainer.pointId, true);
                    }
                }
                else if (canUseDie1 || canUseDie2) {
                    if (checkerContainer instanceof Point) {
                        (<Point>checkerContainer).setSelected(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        (<Bar>checkerContainer).setSelected(this.currentPlayerId, true);
                    }
                    this.currentSelectedCheckerContainer = checkerContainer;
                    this.evaluateBoard();
                }
                // otherwise there was a legal move but this wasn't it
            }
            else if (checkerContainer.pointId === this.currentSelectedCheckerContainer.pointId) {
                if (this.currentSelectedCheckerContainer instanceof Point) {
                    (<Point>this.currentSelectedCheckerContainer).setSelected(false);
                }
                this.currentSelectedCheckerContainer = undefined;
                this.evaluateBoard();
            }
            else {

                let useDieIfPossible = (die: Die): boolean => {
                    let destinationPointId = Board.getDestinationPointId(this.currentPlayerId, this.currentSelectedCheckerContainer.pointId, die.value);
                    if (destinationPointId !== checkerContainer.pointId) {
                        return false;
                    }

                    this.board.move(this.currentPlayerId, this.currentSelectedCheckerContainer.pointId, die.value);
                    die.decrementRemainingUses();
                    if (this.currentSelectedCheckerContainer instanceof Point) {
                        (<Point>this.currentSelectedCheckerContainer).setSelected(false);
                    }
                    this.currentSelectedCheckerContainer = undefined;
                    this.evaluateBoard();
                    return true;
                }

                // use lazy evaluation so that max one die gets used
                useDieIfPossible(this.dice.die1) || useDieIfPossible(this.dice.die2);

                this.switchPlayerIfNoValidMovesRemain();

                // reinspect point
                if (this.board.onPointInspected) {
                    this.board.onPointInspected(checkerContainer.pointId, false);
                    this.board.onPointInspected(checkerContainer.pointId, true);
                }
            }
        };

        board.initialise();
        this.logCurrentPlayer();
        this.evaluateBoard();
        this.switchPlayerIfNoValidMovesRemain();
    }

    private checkIfValidMovesRemain(): boolean {
        if (this.dice.die1.remainingUses == 0 && this.dice.die2.remainingUses == 0) {
            return false;
        }

        let isValidMove = (die: Die, pointId: number): boolean => {
            return (die.remainingUses > 0) && this.board.isLegalMove(this.currentPlayerId, pointId, die.value);
        }
        for (let pointId = 1; pointId <= 25; pointId++) {
            if (isValidMove(this.dice.die1, pointId) || isValidMove(this.dice.die2, pointId)) {
                return true;
            }
        }

        this.statusLogger.logInfo('No valid moves remain!');
        return false;
    }

    private switchPlayerIfNoValidMovesRemain(): void {
        if (this.board.checkerContainers[PointId.HOME].checkers[this.currentPlayerId] === 15) {
            this.statusLogger.logInfo(`${PlayerId[this.currentPlayerId]} WINS!`);
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
            let computerPlayer = <ComputerPlayer>this.players[this.currentPlayerId];
            let bestPossibleGo = computerPlayer.getBestPossibleGo(this.dice);
            if (bestPossibleGo) {
                for (let moveNumber = 0; moveNumber < bestPossibleGo.moves.length; moveNumber++) {
                    let move = bestPossibleGo.moves[moveNumber];
                    this.board.move(this.currentPlayerId, move.sourcePointId, move.numberOfPointsToMove);
                }
                console.log(bestPossibleGo);
            }
            setTimeout(() => {
                this.switchPlayer();
                this.dice.roll(this.currentPlayerId);
                this.evaluateBoard();
                this.switchPlayerIfNoValidMovesRemain();
            }, 500);
        }
    }

    static getOtherPlayer(player: PlayerId): PlayerId {
        return player === PlayerId.BLACK ? PlayerId.RED : PlayerId.BLACK;
    }

    switchPlayer(): void {
        this.currentPlayerId = (this.currentPlayerId + 1) % 2;
        this.logCurrentPlayer();
    }

    evaluateBoard(): void {
        if (this.currentSelectedCheckerContainer != undefined) {
            for (let i = 1; i <= 24; i++) {
                if (i !== this.currentSelectedCheckerContainer.pointId) {
                    (<Point>this.board.checkerContainers[i]).setValidSource(false);
                }
            }
            return;
        }

        let isValidSource = (pointId: number): boolean => {
            if (this.board.checkerContainers[pointId].checkers[this.currentPlayerId] > 0) {
                for (let die of [this.dice.die1, this.dice.die2]) {
                    if ((die.remainingUses > 0) &&
                        (this.board.isLegalMove(this.currentPlayerId, pointId, die.value))) {
                        return true;
                    }
                }
            }
            return false;
        };

        (<Bar>this.board.checkerContainers[PointId.BAR]).setValidSource(this.currentPlayerId, isValidSource(PointId.BAR));
        for (let i = 1; i <= 24; i++) {
            (<Point>this.board.checkerContainers[i]).setValidSource(isValidSource(i));
        }
    }

    logCurrentPlayer(): void {
        this.statusLogger.logInfo(`${PlayerId[this.currentPlayerId]} to move`);
    }
}