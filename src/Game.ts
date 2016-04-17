/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="StatusLogger.ts"/>

class Game {
    
    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;
    constructor(board: Board, dice: Dice, statusLogger: StatusLogger) {
        this.board = board;
        this.dice = dice;
        this.statusLogger = statusLogger;
        
        // TODO: roll to see who starts. Assume BLACK.
        this.statusLogger.logInfo('BLACK to move');
        
        this.dice.roll();
    }
}