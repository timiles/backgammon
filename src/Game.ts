/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>

class Game {
    
    board: Board;
    dice: Dice;
    constructor(board: Board, dice: Dice) {
        this.board = board;
        this.dice = dice;
                
        this.dice.roll();
    }
}