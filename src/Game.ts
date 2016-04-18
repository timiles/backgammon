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
        
        this.board.onPointSelected = (point: Point, selected: boolean) => {
            if (point.checkers[self.currentPlayer] > 0) {
                self.board.highlightPointIfLegal(point.pointId + self.dice.roll1, self.currentPlayer, selected);
                if (self.dice.roll2 !== self.dice.roll1) {
                    self.board.highlightPointIfLegal(point.pointId + self.dice.roll2, self.currentPlayer, selected);
                }
            }
        };
        
        
        this.statusLogger = new StatusLogger(new StatusUI(statusElementId));
        
        // TODO: roll to see who starts. Assume BLACK.
        this.currentPlayer = Player.BLACK;
        this.statusLogger.logInfo('BLACK to move');
        
        this.dice.roll();
    }
}