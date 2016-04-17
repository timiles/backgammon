/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="StatusLogger.ts"/>

enum Player { BLACK, RED }

class Game {
    
    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;
    constructor(boardElementId: string, diceElementId: string, statusElementId: string) {
        this.board = new Board(new BoardUI(boardElementId));
        this.dice = new Dice(new DiceUI(diceElementId));
        this.statusLogger = new StatusLogger(new StatusUI(statusElementId));
        
        // TODO: roll to see who starts. Assume BLACK.
        this.statusLogger.logInfo('BLACK to move');
        
        this.dice.roll();
    }
}