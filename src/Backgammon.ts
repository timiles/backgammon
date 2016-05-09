/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Game.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>

class Backgammon {
    
    constructor(containerId: string) {
        
        let ui = new GameUI(containerId);
        let board = new Board(ui.boardUI);
        let dice = new Dice(ui.blackDiceUI, ui.redDiceUI);
        let statusLogger = new StatusLogger(ui.statusUI);

        new Game(ui, board, dice, statusLogger);
    }
}