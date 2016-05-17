/// <reference path="Board.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>

class Game {
    
    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;
    
    currentPlayer: Player;
    currentSelectedCheckerContainer: CheckerContainer;
    
    constructor(gameUI: GameUI, board: Board, dice: Dice, statusLogger: StatusLogger, currentPlayer: Player) {

        this.board = board;        
        this.dice = dice;
        this.statusLogger = statusLogger;
        this.currentPlayer = currentPlayer;
        this.logCurrentPlayer();
        this.evaluateBoard();
        
        this.board.onPointInspected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (this.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }
            
            if (!on) {
                this.board.removeAllHighlights();
                return;
            }
            
            if (!(checkerContainer instanceof Home) && (checkerContainer.checkers[this.currentPlayer] > 0)) {
                for (let die of [this.dice.die1, this.dice.die2]) {
                    if (die.remainingUses > 0) {
                        this.board.checkIfValidDestination(this.currentPlayer, checkerContainer.pointId, die.value);
                    }
                }
            }
        };
        
        this.board.onPointSelected = (checkerContainer: CheckerContainer) => {
            if (this.currentSelectedCheckerContainer == undefined) {
                if (checkerContainer.checkers[this.currentPlayer] == 0) {
                    // if no pieces here, exit
                    return;
                }

                let canUseDie = (die: Die): boolean => {
                    return (die.remainingUses > 0 &&
                        this.board.isLegalMove(this.currentPlayer, checkerContainer.pointId, die.value));
                }
                
                let canBearOff = (die: Die): boolean => {
                    return (die.remainingUses > 0 &&
                        Board.getDestinationPointId(this.currentPlayer, checkerContainer.pointId, die.value) === PointId.HOME &&
                        this.board.isLegalMove(this.currentPlayer, checkerContainer.pointId, die.value));
                }

                let canUseDie1 = canUseDie(this.dice.die1);
                let canUseDie2 = canUseDie(this.dice.die2);

                // if can use one die but not the other, or if it's doubles, or if both bear off home, just play it
                if ((canUseDie1 != canUseDie2) || 
                    (this.dice.die1.value === this.dice.die2.value) ||
                    (canBearOff(this.dice.die1) && canBearOff(this.dice.die2))) {
                    if (canUseDie1) {
                        this.board.move(this.currentPlayer, checkerContainer.pointId, this.dice.die1.value);
                        this.dice.die1.decrementRemainingUses();
                        this.evaluateBoard();                                        
                    }
                    else if (canUseDie2) {
                        this.board.move(this.currentPlayer, checkerContainer.pointId, this.dice.die2.value);
                        this.dice.die2.decrementRemainingUses();
                        this.evaluateBoard();                                        
                    }
                    
                    this.switchPlayerIfNoValidMovesRemain();
                    
                    // reinspect point
                    this.board.onPointInspected(checkerContainer, false);
                    this.board.onPointInspected(checkerContainer, true);
                }
                else if (canUseDie1 || canUseDie2) {
                    if (checkerContainer instanceof Point) {
                        (<Point> checkerContainer).setSelected(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        (<Bar> checkerContainer).setSelected(this.currentPlayer, true);
                    }
                    this.currentSelectedCheckerContainer = checkerContainer;
                    this.evaluateBoard();
                }
                // otherwise there was a legal move but this wasn't it
            }
            else if (checkerContainer.pointId === this.currentSelectedCheckerContainer.pointId) {
                if (this.currentSelectedCheckerContainer instanceof Point) {
                    (<Point> this.currentSelectedCheckerContainer).setSelected(false);
                }
                this.currentSelectedCheckerContainer = undefined;
                this.evaluateBoard();
            }
            else {

                let useDieIfPossible = (die: Die): boolean => {
                    let destinationPointId = Board.getDestinationPointId(this.currentPlayer, this.currentSelectedCheckerContainer.pointId, die.value);
                    if (destinationPointId !== checkerContainer.pointId) {
                        return false;
                    }
                    
                    this.board.move(this.currentPlayer, this.currentSelectedCheckerContainer.pointId, die.value);
                    die.decrementRemainingUses();
                    if (this.currentSelectedCheckerContainer instanceof Point) {
                        (<Point> this.currentSelectedCheckerContainer).setSelected(false);
                    }
                    this.currentSelectedCheckerContainer = undefined;           
                    this.evaluateBoard();
                    return true;
                }

                // use lazy evaluation so that max one die gets used
                useDieIfPossible(this.dice.die1) || useDieIfPossible(this.dice.die2);

                this.switchPlayerIfNoValidMovesRemain();
                                
                // reinspect point
                this.board.onPointInspected(checkerContainer, false);
                this.board.onPointInspected(checkerContainer, true);
            }
        };       
        
    }
    
    private checkIfValidMovesRemain(): boolean {
        if (this.dice.die1.remainingUses == 0 && this.dice.die2.remainingUses == 0) {
            return false;
        }
        
        let isValidMove = (die: Die, pointId: number): boolean => {
            return (die.remainingUses > 0) && this.board.isLegalMove(this.currentPlayer, pointId, die.value);
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
        if (this.board.checkerContainers[PointId.HOME].checkers[this.currentPlayer] === 15) {
            this.statusLogger.logInfo(`${Player[this.currentPlayer]} WINS!`);
            return;
        }
        if (!this.checkIfValidMovesRemain()) {
            // if we're still here, 
            this.switchPlayer();
            this.dice.roll(this.currentPlayer);
            this.evaluateBoard();
            this.switchPlayerIfNoValidMovesRemain();
        }
    }
 
    static getOtherPlayer(player: Player): Player {
        return player === Player.BLACK ? Player.RED : Player.BLACK;
    }
        
    switchPlayer(): void {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.logCurrentPlayer();
    }
    
    evaluateBoard(): void {
        if (this.currentSelectedCheckerContainer != undefined) {
            for (let i = 1; i <= 24; i++) {
                if (i !== this.currentSelectedCheckerContainer.pointId) {
                    (<Point> this.board.checkerContainers[i]).setValidSource(false);
                }
            }
            return;
        }
        
        let isValidSource = (pointId: number): boolean => {
            if (this.board.checkerContainers[pointId].checkers[this.currentPlayer] > 0) {
                for (let die of [this.dice.die1, this.dice.die2]) {
                    if ((die.remainingUses > 0) &&
                        (this.board.isLegalMove(this.currentPlayer, pointId, die.value))) {
                            return true;
                    }
                }
            }
            return false;
        };

        (<Bar> this.board.checkerContainers[PointId.BAR]).setValidSource(this.currentPlayer, isValidSource(PointId.BAR));
        for (let i = 1; i <= 24; i++) {
            (<Point> this.board.checkerContainers[i]).setValidSource(isValidSource(i));
        }        
    }
    
    logCurrentPlayer(): void {
        this.statusLogger.logInfo(`${Player[this.currentPlayer]} to move`);
    }
}