import { Bar } from 'BoardComponents/Bar'
import { Board } from 'BoardComponents/Board'
import { CheckerContainer } from 'BoardComponents/CheckerContainer'
import { Home } from 'BoardComponents/Home'
import { Point } from 'BoardComponents/Point'

import { Dice } from 'DiceComponents/Dice'
import { Die } from 'DiceComponents/Die'

import { ComputerPlayer } from 'Players/ComputerPlayer'
import { HumanPlayer } from 'Players/HumanPlayer'
import { Player } from 'Players/Player'

import { Move } from './Move'
import { PlayerId, PointId } from './Enums'
import { StatusLogger } from './StatusLogger'

export class Game {

    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;

    currentPlayerId: PlayerId;
    players: Player[];
    currentSelectedCheckerContainer: CheckerContainer;

    constructor(board: Board, dice: Dice, statusLogger: StatusLogger, isComputerPlayer = [false, false]) {

        this.board = board;
        this.dice = dice;
        this.statusLogger = statusLogger;

        this.players = new Array<Player>(2);
        for (let playerId of [PlayerId.BLACK, PlayerId.RED]) {
            this.players[playerId] = (isComputerPlayer[playerId]) ? new ComputerPlayer(playerId, this.board) : new HumanPlayer(playerId, this.board);
        }

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
                        this.board.checkIfValidDestination(new Move(this.currentPlayerId, checkerContainer.pointId, die.value));
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
                    let move = new Move(this.currentPlayerId, checkerContainer.pointId, die.value);
                    return (die.remainingUses > 0 && this.board.isLegalMove(move));
                }

                let canBearOff = (die: Die): boolean => {
                    let move = new Move(this.currentPlayerId, checkerContainer.pointId, die.value);
                    return (die.remainingUses > 0 &&
                        move.getDestinationPointId() === PointId.HOME &&
                        this.board.isLegalMove(move));
                }

                let canUseDie1 = canUseDie(this.dice.die1);
                let canUseDie2 = canUseDie(this.dice.die2);

                // if can use one die but not the other, or if it's doubles, or if both bear off home, just play it
                if ((canUseDie1 != canUseDie2) ||
                    (this.dice.die1.value === this.dice.die2.value) ||
                    (canBearOff(this.dice.die1) && canBearOff(this.dice.die2))) {
                    
                    if (canUseDie1) {
                        this.board.move(new Move(this.currentPlayerId, checkerContainer.pointId, this.dice.die1.value));
                        this.dice.die1.decrementRemainingUses();
                        this.evaluateBoard();
                    }
                    else if (canUseDie2) {
                        this.board.move(new Move(this.currentPlayerId, checkerContainer.pointId, this.dice.die2.value));
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
                    let move = new Move(this.currentPlayerId, this.currentSelectedCheckerContainer.pointId, die.value);
                    let destinationPointId = move.getDestinationPointId();
                    if (destinationPointId !== checkerContainer.pointId) {
                        return false;
                    }

                    this.board.move(move);
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
    }

    begin(startingPlayerId: PlayerId): void {
        this.currentPlayerId = startingPlayerId;
        this.logCurrentPlayer();
        this.evaluateBoard();
        this.switchPlayerIfNoValidMovesRemain();
    }

    private checkIfValidMovesRemain(): boolean {
        if (this.dice.die1.remainingUses == 0 && this.dice.die2.remainingUses == 0) {
            return false;
        }

        let isValidMove = (die: Die, pointId: number): boolean => {
            return (die.remainingUses > 0) && this.board.isLegalMove(new Move(this.currentPlayerId, pointId, die.value));
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
            let bestPossibleGo = computerPlayer.getBestPossibleGo(this.dice.die1.value, this.dice.die2.value);
            if (bestPossibleGo) {
                for (let moveNumber = 0; moveNumber < bestPossibleGo.moves.length; moveNumber++) {
                    let move = bestPossibleGo.moves[moveNumber];
                    this.board.move(move);
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

    static getOtherPlayerId(player: PlayerId): PlayerId {
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
                        (this.board.isLegalMove(new Move(this.currentPlayerId, pointId, die.value)))) {
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