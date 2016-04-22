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
        
        this.board.onPointInspected = (point: Point, on: boolean) => {
            if (!on) {
                // turn off highlights if any
                point.highlightSource(false);
                self.board.highlightPointIfLegal(self.currentPlayer, self.getDestinationPointId(point.pointId, self.dice.die1.value), on);
                self.board.highlightPointIfLegal(self.currentPlayer, self.getDestinationPointId(point.pointId, self.dice.die2.value), on);
            }
            else if (point.checkers[self.currentPlayer] > 0) {
                point.highlightSource(true);
                if (self.dice.die1.remainingUses > 0) {
                    self.board.highlightPointIfLegal(self.currentPlayer, self.getDestinationPointId(point.pointId, self.dice.die1.value), on);
                }
                if (self.dice.die2.remainingUses > 0) {
                    self.board.highlightPointIfLegal(self.currentPlayer, self.getDestinationPointId(point.pointId, self.dice.die2.value), on);
                }
            }
        };
        
        this.board.onPointSelected = (point: Point, on: boolean) => {
            if (point.checkers[self.currentPlayer] > 0) {
                if (self.dice.die1.remainingUses > 0 &&
                    self.board.isLegal(self.currentPlayer, self.getDestinationPointId(point.pointId, self.dice.die1.value))) {
                    self.board.move(self.currentPlayer, point.pointId, self.getDestinationPointId(point.pointId, self.dice.die1.value));
                    self.dice.die1.remainingUses--;
                }
                else if (self.dice.die2.remainingUses > 0 &&
                    self.board.isLegal(self.currentPlayer, self.getDestinationPointId(point.pointId, self.dice.die2.value))) {
                    self.board.move(self.currentPlayer, point.pointId, self.getDestinationPointId(point.pointId, self.dice.die2.value));
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

    /**
     * @deprecated This code is moved to Board.ts
     */
    getDestinationPointId(startPointId: number, dieValue: number): number {
        let direction = this.currentPlayer == Player.BLACK ? 1 : -1;
        return startPointId + (direction * dieValue);
    }   
     
    switchPlayer(): void {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.logCurrentPlayer();
    }
    
    logCurrentPlayer(): void {
        this.statusLogger.logInfo(`${Player[this.currentPlayer]} to move`);        
    }
}