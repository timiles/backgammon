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
    
    constructor(containerId) {
        let self = this;

        let ui = new GameUI(containerId);
        this.dice = new Dice(ui.blackDiceUI, ui.redDiceUI);
        this.board = new Board(ui.boardUI);
        
        this.board.onPointInspected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (self.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }
            
            if (!on) {
                // turn off highlights if any
                if (checkerContainer instanceof Point) {
                    (<Point> checkerContainer).highlightSource(false);
                }
                else if (checkerContainer instanceof Bar) {
                    (<Bar> checkerContainer).highlightSource(Player.BLACK, false);
                    (<Bar> checkerContainer).highlightSource(Player.RED, false);
                }
                self.board.removeAllHighlights();
            }
            else if (checkerContainer.checkers[self.currentPlayer] > 0) {
                let validMoveExists = false;
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
                        (<Point> checkerContainer).highlightSource(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        (<Bar> checkerContainer).highlightSource(this.currentPlayer, true);
                    }
                }
            }
        };
        
        this.board.onPointSelected = (point: Point, on: boolean) => {
            if (self.currentSelectedCheckerContainer == undefined) {
                if (point.checkers[self.currentPlayer] == 0) {
                    // if no pieces here, exit
                    return;
                }
                
                let canUseDie = (die: Die) => {
                    return (die.remainingUses > 0 &&
                        self.board.isLegalMove(self.currentPlayer, point.pointId, die.value));
                }

                let canUseDie1 = canUseDie(self.dice.die1);
                let canUseDie2 = canUseDie(self.dice.die2);

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
                    this.board.onPointInspected(point, false);
                    this.board.onPointInspected(point, true);
                }
                else {
                    this.currentSelectedCheckerContainer = point;
                }
            }
            else if (point.pointId === this.currentSelectedCheckerContainer.pointId) {
                this.currentSelectedCheckerContainer = undefined;
                // reinspect point
                this.board.onPointInspected(point, false);
                this.board.onPointInspected(point, true);
            }
            else {
                
                let isUsingDie = (die: Die) => {
                    return (Math.abs(point.pointId - this.currentSelectedCheckerContainer.pointId) === die.value);
                }

                if (isUsingDie(self.dice.die1)) {
                    self.board.move(self.currentPlayer, this.currentSelectedCheckerContainer.pointId, self.dice.die1.value);
                    self.dice.die1.decrementRemainingUses();
                    this.currentSelectedCheckerContainer = undefined;           
                }
                else if (isUsingDie(self.dice.die2)) {
                    self.board.move(self.currentPlayer, this.currentSelectedCheckerContainer.pointId, self.dice.die2.value);
                    self.dice.die2.decrementRemainingUses();
                    this.currentSelectedCheckerContainer = undefined;           
                }

                self.switchPlayerIfNoValidMovesRemain();
                                
                // reinspect point
                this.board.onPointInspected(point, false);
                this.board.onPointInspected(point, true);
            }
        };
        
        
        this.statusLogger = new StatusLogger(ui.statusUI);
        
        // TODO: roll to see who starts. Assume BLACK.
        this.currentPlayer = Player.BLACK;
        this.logCurrentPlayer();
        
        this.dice.roll(this.currentPlayer);
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
        if (!this.checkIfValidMovesRemain()) {
            // if we're still here, 
            this.switchPlayer();
            this.dice.roll(this.currentPlayer);
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
    
    logCurrentPlayer(): void {
        this.statusLogger.logInfo(`${Player[this.currentPlayer]} to move`);
    }
}