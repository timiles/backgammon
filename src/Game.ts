/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="StatusLogger.ts"/>

enum Player { BLACK, RED }

class Game {
    
    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;
    currentPlayer: Player;
    
    constructor(boardElementId: string, diceElementId: string, statusElementId: string) {
        let self = this;

        this.dice = new Dice(new DiceUI(diceElementId));
        this.board = new Board(new BoardUI(boardElementId));
        
        this.board.onPointInspected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (!on) {
                // turn off highlights if any
                if (checkerContainer instanceof Point) {
                    (<Point> checkerContainer).highlightSource(false);
                }
                self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die1.value, on);
                self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die2.value, on);
            }
            else if (checkerContainer.checkers[self.currentPlayer] > 0) {
                if (checkerContainer instanceof Point) {
                    (<Point> checkerContainer).highlightSource(true);
                }
                if (self.dice.die1.remainingUses > 0) {
                    self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die1.value, on);
                }
                if (self.dice.die2.remainingUses > 0) {
                    self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die2.value, on);
                }
            }
        };
        
        this.board.onPointSelected = (point: Point, on: boolean) => {
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